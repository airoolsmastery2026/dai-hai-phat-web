import {
  SupabaseRestError,
  SupabaseServerConfigurationError,
  supabaseRestRequest,
} from "@/lib/server/supabase-rest";

export interface AdminProjectInquiry {
  id: string;
  full_name: string;
  phone: string;
  project_area: string;
  service: string;
  budget: string | null;
  timeline: string | null;
  status: "new" | "contacted" | "qualified" | "closed";
  created_at: string;
}

export type AdminContentReadResult =
  | { ok: true; inquiries: AdminProjectInquiry[] }
  | { ok: false; inquiries: []; message: string };

export async function listAdminProjectInquiries(
  limit = 50,
): Promise<AdminContentReadResult> {
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const query = new URLSearchParams({
    select:
      "id,full_name,phone,project_area,service,budget,timeline,status,created_at",
    order: "created_at.desc",
    limit: String(safeLimit),
  });

  try {
    const inquiries = await supabaseRestRequest<AdminProjectInquiry[]>(
      "project_inquiries",
      { query, signal: AbortSignal.timeout(6_000) },
    );
    return { ok: true, inquiries };
  } catch (error) {
    if (error instanceof SupabaseServerConfigurationError) {
      return {
        ok: false,
        inquiries: [],
        message: "Kho hồ sơ Supabase chưa được cấu hình trên server.",
      };
    }
    if (error instanceof SupabaseRestError) {
      return {
        ok: false,
        inquiries: [],
        message: "Không thể đọc kho hồ sơ khách hàng lúc này.",
      };
    }
    return {
      ok: false,
      inquiries: [],
      message: "Kho hồ sơ đang tạm thời không khả dụng.",
    };
  }
}
