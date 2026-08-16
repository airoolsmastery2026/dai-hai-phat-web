import type {
  CRMHandoffRequest,
  CRMHandoffResponse,
} from "@/lib/ai/handoff";
import {
  SupabaseRestError,
  SupabaseServerConfigurationError,
  supabaseRestRequest,
} from "@/lib/server/supabase-rest";

const INQUIRY_TIMEOUT_MS = 6_000;

interface ProjectInquiryRow {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectInquiryRecord {
  request_id: string;
  full_name: string;
  phone: string;
  zalo_contact: string | null;
  project_area: string;
  service: string;
  dimensions: string;
  budget: string | null;
  timeline: string | null;
  purpose: "build" | "renovate" | "reference";
  readiness_score: number;
  readiness_decision: "not_ready" | "ready_for_follow_up";
  readiness_missing?: string[];
  notes?: string | null;
  description?: string;
  has_site_image?: boolean;
  has_reference_image?: boolean;
  consented_at?: string;
  updated_at?: string;
}

export class ProjectInquiryDeliveryError extends Error {
  constructor(
    message: string,
    readonly code: "not_configured" | "timeout" | "rejected" | "unavailable",
    readonly upstreamStatus?: number,
  ) {
    super(message);
    this.name = "ProjectInquiryDeliveryError";
  }
}

export async function persistProjectInquiryRecord(
  record: ProjectInquiryRecord,
  options: {
    duplicateStrategy?: "ignore" | "merge";
    signal?: AbortSignal;
  } = {},
): Promise<ProjectInquiryRow | null> {
  const duplicateStrategy = options.duplicateStrategy ?? "ignore";
  const query = new URLSearchParams({ on_conflict: "request_id" });
  const prefer =
    duplicateStrategy === "merge"
      ? "resolution=merge-duplicates,return=representation"
      : "resolution=ignore-duplicates,return=representation";

  const rows = await supabaseRestRequest<ProjectInquiryRow[]>("project_inquiries", {
    method: "POST",
    query,
    prefer,
    signal: options.signal,
    body: record,
  });

  return rows[0] ?? null;
}

function inquiryPurpose(lead: CRMHandoffRequest): ProjectInquiryRecord["purpose"] {
  const context = `${lead.project.intent} ${lead.project.service}`.toLocaleLowerCase("vi-VN");
  if (/cải tạo|sửa chữa|sau thi công|bảo trì/.test(context)) return "renovate";
  if (/tham khảo|hợp tác|khác/.test(context)) return "reference";
  return "build";
}

function inquiryNotes(lead: CRMHandoffRequest): string {
  return JSON.stringify({
    projectType: lead.project.projectType,
    location: lead.project.location,
    style: lead.project.style,
    material: lead.project.material,
    priority: lead.project.priority,
    surveyWindow: lead.project.surveyWindow,
    quoteRequest: lead.project.quoteRequest,
    email: lead.contact.email ?? null,
    imageCount: lead.project.imageCount,
  });
}

export async function persistProjectInquiry(
  lead: CRMHandoffRequest,
): Promise<CRMHandoffResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), INQUIRY_TIMEOUT_MS);

  try {
    const now = new Date().toISOString();
    const row = await persistProjectInquiryRecord(
      {
        request_id: lead.sessionId,
        full_name: lead.contact.name,
        phone: lead.contact.phone,
        zalo_contact: lead.contact.zalo ?? null,
        project_area: lead.contact.surveyAddress,
        service: lead.project.service,
        dimensions: lead.project.dimensions,
        budget: lead.project.budget,
        timeline: lead.project.timeline,
        purpose: inquiryPurpose(lead),
        readiness_score: lead.qualification.leadScore,
        readiness_decision: "ready_for_follow_up",
        readiness_missing: [],
        notes: inquiryNotes(lead),
        consented_at: now,
        updated_at: now,
      },
      { duplicateStrategy: "merge", signal: controller.signal },
    );

    if (!row?.id) {
      throw new ProjectInquiryDeliveryError(
        "Kho hồ sơ không trả về mã tiếp nhận.",
        "unavailable",
      );
    }

    return {
      leadId: row.id,
      receivedAt: row.updated_at || row.created_at || now,
    };
  } catch (error) {
    if (error instanceof ProjectInquiryDeliveryError) throw error;
    if (error instanceof SupabaseServerConfigurationError) {
      throw new ProjectInquiryDeliveryError(
        "Kho hồ sơ chưa được cấu hình trên server.",
        "not_configured",
      );
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new ProjectInquiryDeliveryError(
        "Kho hồ sơ phản hồi quá thời gian.",
        "timeout",
      );
    }
    if (error instanceof SupabaseRestError) {
      throw new ProjectInquiryDeliveryError(
        "Kho hồ sơ từ chối yêu cầu.",
        error.status >= 500 ? "unavailable" : "rejected",
        error.status,
      );
    }
    throw new ProjectInquiryDeliveryError(
      "Không thể kết nối kho hồ sơ.",
      "unavailable",
    );
  } finally {
    clearTimeout(timeout);
  }
}
