import type { ConversationSession, ProjectMemory } from "@/lib/ai";
import type { LeadAttribution } from "@/lib/marketing/attribution";

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const ADDRESS_KEYWORDS = [
  "duong",
  "phuong",
  "xa",
  "quan",
  "huyen",
  "thanh pho",
  "tp",
  "tinh",
  "khu pho",
  "ap",
  "thon",
  "hem",
  "ngo",
  "lo",
  "to",
  "block",
  "chung cu",
  "du an",
];

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
  attribution?: LeadAttribution;
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

function normalizeAscii(value: string): string {
  return value
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isPlausibleName(value: string): boolean {
  if (value.length < 2 || !/^[A-Za-zÀ-ỹĐđ][A-Za-zÀ-ỹĐđ\s'.-]*$/.test(value)) return false;
  const ascii = normalizeAscii(value);
  if (!/[aeiouy]/.test(ascii)) return false;
  if (["test", "demo", "fake", "asdf", "qwerty", "abc", "xxx"].includes(ascii)) return false;
  if (!ascii.includes(" ")) {
    const runs = ascii.match(/[bcdfghjklmnpqrstvwxz]{3,}/g) ?? [];
    if (runs.some((run) => !/^(?:ngh|sch|chr|str|thr)$/.test(run))) return false;
  }
  return true;
}

function isVietnamMobile(value: string): boolean {
  if (!/^\+?[\d .()-]+$/.test(value)) return false;
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length === 11) digits = `0${digits.slice(2)}`;
  return /^0[35789]\d{8}$/.test(digits);
}

function isPlausibleSurveyAddress(value: string): boolean {
  if (value.length < 12 || !/\d/.test(value)) return false;
  const normalized = normalizeAscii(value);
  const words = normalized.split(" ").filter(Boolean);
  if (words.length < 4) return false;
  return ADDRESS_KEYWORDS.some((keyword) =>
    new RegExp(`(?:^| )${keyword.replace(/ /g, "\\s+")}(?: |$)`).test(normalized),
  );
}

function parseAttribution(value: unknown): LeadAttribution | undefined {
  if (value === undefined || value === null) return undefined;
  if (!isRecord(value)) {
    throw new CRMHandoffValidationError("Dữ liệu attribution không hợp lệ.");
  }
  const firstTouchAt = text(value.firstTouchAt, "attribution.firstTouchAt", 40);
  if (Number.isNaN(Date.parse(firstTouchAt))) {
    throw new CRMHandoffValidationError("Thời điểm attribution không hợp lệ.");
  }
  return {
    firstTouchAt,
    landingPath: text(value.landingPath, "attribution.landingPath", 300),
    referrer: optionalText(value.referrer, "attribution.referrer", 300),
    utmSource: optionalText(value.utmSource, "attribution.utmSource", 160),
    utmMedium: optionalText(value.utmMedium, "attribution.utmMedium", 160),
    utmCampaign: optionalText(value.utmCampaign, "attribution.utmCampaign", 160),
    utmContent: optionalText(value.utmContent, "attribution.utmContent", 160),
    utmTerm: optionalText(value.utmTerm, "attribution.utmTerm", 160),
  };
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
    imageCount < 0 ||
    imageCount > 5
  ) {
    throw new CRMHandoffValidationError("Số lượng ảnh hiện trạng không hợp lệ.");
  }

  const name = text(value.contact.name, "contact.name", 100);
  if (!isPlausibleName(name)) {
    throw new CRMHandoffValidationError("Tên liên hệ chưa đủ tin cậy để bàn giao.");
  }

  const phone = text(value.contact.phone, "contact.phone", 24);
  if (!isVietnamMobile(phone)) {
    throw new CRMHandoffValidationError("Số điện thoại Việt Nam không hợp lệ.");
  }

  const surveyAddress = text(value.contact.surveyAddress, "contact.surveyAddress", 300);
  if (!isPlausibleSurveyAddress(surveyAddress)) {
    throw new CRMHandoffValidationError("Địa chỉ khảo sát chưa đủ rõ để bàn giao.");
  }

  const email = optionalText(value.contact.email, "contact.email", 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new CRMHandoffValidationError("Email không hợp lệ.");
  }

  const zalo = optionalText(value.contact.zalo, "contact.zalo", 24);
  if (zalo && !isVietnamMobile(zalo)) {
    throw new CRMHandoffValidationError("Số Zalo không hợp lệ.");
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
      name,
      phone,
      surveyAddress,
      email,
      zalo,
    },
    qualification: {
      confidence: score(value.qualification.confidence, "qualification.confidence"),
      leadScore: score(value.qualification.leadScore, "qualification.leadScore"),
    },
    attribution: parseAttribution(value.attribution),
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
  attribution?: LeadAttribution | null,
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
    attribution: attribution ?? undefined,
  });
}

export function buildManualHandoffSummary(
  session: ConversationSession,
): string {
  const handoff = createCRMHandoffRequest(session);
  const imageSummary = handoff.project.imageCount
    ? `${handoff.project.imageCount} ảnh (gửi riêng khi trao đổi)`
    : "Chưa có — khách sẽ bổ sung sau";
  const optionalContact = [
    handoff.contact.email ? `- Email: ${handoff.contact.email}` : null,
    handoff.contact.zalo ? `- Zalo: ${handoff.contact.zalo}` : null,
  ].filter((line): line is string => Boolean(line));

  return [
    "HỒ SƠ TƯ VẤN ĐẠI HẢI PHÁT",
    `Mã hồ sơ: ${handoff.sessionId}`,
    "",
    "Nhu cầu dự án",
    `- Mục tiêu: ${handoff.project.intent}`,
    `- Hạng mục: ${handoff.project.service}`,
    `- Loại công trình: ${handoff.project.projectType}`,
    `- Khu vực: ${handoff.project.location}`,
    `- Kích thước sơ bộ: ${handoff.project.dimensions}`,
    `- Phong cách: ${handoff.project.style}`,
    `- Vật liệu ưu tiên: ${handoff.project.material}`,
    `- Ngân sách dự kiến: ${handoff.project.budget}`,
    `- Thời điểm triển khai: ${handoff.project.timeline}`,
    `- Ưu tiên chính: ${handoff.project.priority}`,
    `- Khung khảo sát: ${handoff.project.surveyWindow}`,
    `- Hồ sơ cần nhận: ${handoff.project.quoteRequest}`,
    `- Ảnh hiện trạng: ${imageSummary}`,
    "",
    "Thông tin liên hệ",
    `- Họ tên: ${handoff.contact.name}`,
    `- Điện thoại: ${handoff.contact.phone}`,
    `- Địa chỉ khảo sát: ${handoff.contact.surveyAddress}`,
    ...optionalContact,
    "",
    "Lưu ý: Đây là dữ liệu khách hàng đã cung cấp. Phương án kỹ thuật và báo giá chính thức cần được kỹ sư khảo sát, xác minh.",
  ].join("\n");
}
