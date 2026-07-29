import type { ConversationSession, ProjectMemory } from "@/lib/ai";

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

export interface CRMHandoffRequest {
  sessionId: string;
  state: "DONE";
  consent: true;
  source: "ai-office";
  project: {
    intent: string;
    service: string;
    projectType: string;
    location: string;
    imageCount: number;
    dimensions: string;
    style: string;
    material: string;
    budget: string;
    timeline: string;
    priority: string;
    surveyWindow: string;
    quoteRequest: string;
  };
  contact: {
    name: string;
    phone: string;
    surveyAddress: string;
    email?: string;
    zalo?: string;
  };
  qualification: {
    confidence: number;
    leadScore: number;
  };
  website?: string;
}

export interface CRMHandoffResponse {
  leadId: string;
  receivedAt: string;
}

export class CRMHandoffValidationError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string") {
    throw new CRMHandoffValidationError(`Thiếu trường ${field}.`);
  }
  const normalized = value.trim().replace(/\s+/g, " ");
  if (
    normalized.length === 0 ||
    normalized.length > maxLength ||
    CONTROL_CHARACTERS.test(normalized)
  ) {
    throw new CRMHandoffValidationError(`Trường ${field} không hợp lệ.`);
  }
  return normalized;
}

function optionalText(
  value: unknown,
  field: string,
  maxLength: number,
): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return text(value, field, maxLength);
}

function score(value: unknown, field: string): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 0 ||
    value > 100
  ) {
    throw new CRMHandoffValidationError(`Trường ${field} không hợp lệ.`);
  }
  return value;
}

export function parseCRMHandoffRequest(value: unknown): CRMHandoffRequest {
  if (!isRecord(value) || !isRecord(value.project) || !isRecord(value.contact)) {
    throw new CRMHandoffValidationError("Hồ sơ bàn giao không đúng định dạng.");
  }
  if (!isRecord(value.qualification)) {
    throw new CRMHandoffValidationError("Dữ liệu đánh giá hồ sơ không hợp lệ.");
  }
  if (value.state !== "DONE" || value.consent !== true || value.source !== "ai-office") {
    throw new CRMHandoffValidationError(
      "Hồ sơ chưa hoàn tất hoặc chưa có đồng ý bàn giao.",
    );
  }

  const imageCount = value.project.imageCount;
  if (
    typeof imageCount !== "number" ||
    !Number.isInteger(imageCount) ||
    imageCount < 1 ||
    imageCount > 5
  ) {
    throw new CRMHandoffValidationError("Số lượng ảnh hiện trạng không hợp lệ.");
  }

  const phone = text(value.contact.phone, "contact.phone", 24);
  if (!/^\+?\d[\d .-]{7,14}\d$/.test(phone)) {
    throw new CRMHandoffValidationError("Số điện thoại không hợp lệ.");
  }
  const email = optionalText(value.contact.email, "contact.email", 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new CRMHandoffValidationError("Email không hợp lệ.");
  }

  return {
    sessionId: text(value.sessionId, "sessionId", 100),
    state: "DONE",
    consent: true,
    source: "ai-office",
    project: {
      intent: text(value.project.intent, "project.intent", 80),
      service: text(value.project.service, "project.service", 80),
      projectType: text(value.project.projectType, "project.projectType", 80),
      location: text(value.project.location, "project.location", 100),
      imageCount,
      dimensions: text(value.project.dimensions, "project.dimensions", 300),
      style: text(value.project.style, "project.style", 100),
      material: text(value.project.material, "project.material", 120),
      budget: text(value.project.budget, "project.budget", 80),
      timeline: text(value.project.timeline, "project.timeline", 80),
      priority: text(value.project.priority, "project.priority", 200),
      surveyWindow: text(value.project.surveyWindow, "project.surveyWindow", 100),
      quoteRequest: text(value.project.quoteRequest, "project.quoteRequest", 100),
    },
    contact: {
      name: text(value.contact.name, "contact.name", 100),
      phone,
      surveyAddress: text(
        value.contact.surveyAddress,
        "contact.surveyAddress",
        300,
      ),
      email,
      zalo: optionalText(value.contact.zalo, "contact.zalo", 24),
    },
    qualification: {
      confidence: score(value.qualification.confidence, "qualification.confidence"),
      leadScore: score(value.qualification.leadScore, "qualification.leadScore"),
    },
    website: optionalText(value.website, "website", 120),
  };
}

function requiredMemory(memory: ProjectMemory, field: keyof ProjectMemory): string {
  const value = memory[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new CRMHandoffValidationError(`Hồ sơ thiếu trường ${field}.`);
  }
  return value;
}

export function createCRMHandoffRequest(
  session: ConversationSession,
): CRMHandoffRequest {
  if (session.state !== "DONE") {
    throw new CRMHandoffValidationError("Hồ sơ chưa hoàn tất.");
  }

  return parseCRMHandoffRequest({
    sessionId: session.id,
    state: session.state,
    consent: true,
    source: "ai-office",
    project: {
      intent: requiredMemory(session.memory, "intent"),
      service: requiredMemory(session.memory, "service"),
      projectType: requiredMemory(session.memory, "projectType"),
      location: requiredMemory(session.memory, "location"),
      imageCount: session.memory.images.length,
      dimensions: requiredMemory(session.memory, "dimensions"),
      style: requiredMemory(session.memory, "style"),
      material: requiredMemory(session.memory, "material"),
      budget: requiredMemory(session.memory, "budget"),
      timeline: requiredMemory(session.memory, "timeline"),
      priority: requiredMemory(session.memory, "priority"),
      surveyWindow: requiredMemory(session.memory, "surveyWindow"),
      quoteRequest: requiredMemory(session.memory, "quoteRequest"),
    },
    contact: {
      name: requiredMemory(session.memory, "name"),
      phone: requiredMemory(session.memory, "phone"),
      surveyAddress: requiredMemory(session.memory, "surveyAddress"),
      email: session.memory.email,
      zalo: session.memory.zalo,
    },
    qualification: {
      confidence: session.confidence,
      leadScore: session.leadScore,
    },
  });
}
