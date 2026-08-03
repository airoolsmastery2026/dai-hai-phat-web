export type ConceptReadinessDecision =
  | "needs_information"
  | "requires_review"
  | "ready";

export interface ConceptReadinessProfile {
  name: string;
  phone: string;
  zalo: string;
  projectArea: string;
  service: string;
  dimensions: string;
  budget: string;
  timeline: string;
  purpose: "build" | "renovate" | "reference" | "";
  description: string;
  hasSiteImage: boolean;
  hasReferenceImage: boolean;
  consent: boolean;
}

export interface ConceptReadinessResult {
  score: number;
  decision: ConceptReadinessDecision;
  missing: string[];
  reasons: string[];
}

const PHONE_PATTERN = /^(?:\+?84|0)\d{9}$/;

export function normalizeVietnamPhone(value: string): string {
  return value.replace(/[\s.-]/g, "");
}

export function evaluateConceptReadiness(
  profile: ConceptReadinessProfile,
): ConceptReadinessResult {
  const phone = normalizeVietnamPhone(profile.phone);
  const missing: string[] = [];
  const reasons: string[] = [];
  let rawScore = 0;

  if (profile.name.trim().length >= 2) rawScore += 10;
  else missing.push("Họ và tên");

  if (PHONE_PATTERN.test(phone)) rawScore += 20;
  else missing.push("Số điện thoại hợp lệ");

  if (profile.zalo.trim().length >= 8) rawScore += 5;
  else reasons.push("Chưa có thông tin Zalo để kỹ sư liên hệ nhanh.");

  if (profile.projectArea.trim().length >= 5) rawScore += 10;
  else missing.push("Khu vực hoặc địa chỉ công trình");

  if (profile.service.trim()) rawScore += 10;
  else missing.push("Hạng mục cần thực hiện");

  if (profile.dimensions.trim().length >= 3) rawScore += 10;
  else missing.push("Kích thước ước tính");

  if (profile.budget.trim()) rawScore += 5;
  else reasons.push("Chưa có khoảng ngân sách dự kiến.");

  if (profile.timeline.trim()) rawScore += 5;
  else reasons.push("Chưa có thời gian dự kiến triển khai.");

  if (profile.purpose === "build" || profile.purpose === "renovate") {
    rawScore += 10;
  } else if (profile.purpose === "reference") {
    reasons.push("Nhu cầu hiện được đánh dấu là chỉ tham khảo.");
  } else {
    missing.push("Mục đích thực hiện");
  }

  if (profile.description.trim().length >= 100) rawScore += 10;
  else reasons.push("Mô tả dự án nên có ít nhất 100 ký tự.");

  if (profile.hasSiteImage) rawScore += 3;
  else missing.push("Ảnh hiện trạng");

  if (profile.hasReferenceImage) rawScore += 2;
  else missing.push("Ảnh mẫu tham khảo");

  if (profile.consent) rawScore += 5;
  else missing.push("Đồng ý gửi hồ sơ cho Đại Hải Phát");

  const score = Math.min(100, rawScore);
  const hasRequiredIdentity =
    profile.name.trim().length >= 2 &&
    PHONE_PATTERN.test(phone) &&
    profile.projectArea.trim().length >= 5 &&
    profile.service.trim().length > 0 &&
    profile.consent;

  let decision: ConceptReadinessDecision;
  if (!hasRequiredIdentity || score < 55) decision = "needs_information";
  else if (score < 80 || profile.purpose === "reference") {
    decision = "requires_review";
  } else decision = "ready";

  return { score, decision, missing, reasons };
}
