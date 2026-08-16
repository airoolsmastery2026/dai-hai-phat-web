import type {
  ProjectAnalysisContent,
  ProjectAnalysisOption,
} from "@/lib/ai/analysis";

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const ACCENTED_LATIN = /[\u00c0-\u024f\u1ea0-\u1ef9]/;
const FORBIDDEN_OUTPUT =
  /(?:```|^\s*(?:#{1,6}|[-*•>])\s+|(?:^|\s)(?:json\s+schema|system\s+prompt|developer\s+message|assistant\s+message|prompt\s+injection|language\s+model|mô\s+hình\s+ngôn\s+ngữ|gemini)(?:\s|[.,;:!?]|$)|https?:\/\/|www\.)/i;
const ROBOTIC_ACKNOWLEDGEMENT =
  /^(?:đã ghi nhận|tôi đã ghi nhận|thông tin (?:đã|vừa) được ghi nhận)\b/i;
const GENERIC_OPTION_NAME =
  /^(?:a|b|1|2|option\s*\d+|phương\s+án\s*\d+)$/i;
const TERMINAL_PUNCTUATION = /[.!?…]$/;
const SENTENCE_BOUNDARY = /[.!?…]+(?=\s|$)/g;

export class ProjectAnalysisLanguageQualityError extends Error {}

function normalizeVisibleText(
  value: string,
  field: string,
  maxLength: number,
): string {
  const normalized = value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?…])/g, "$1")
    .replace(/([!?])\1+/g, "$1")
    .replace(/\.{4,}/g, "…")
    .replace(/\bAI\b/g, "trợ lý");

  if (
    !normalized ||
    normalized.length > maxLength ||
    CONTROL_CHARACTERS.test(normalized) ||
    FORBIDDEN_OUTPUT.test(normalized)
  ) {
    throw new ProjectAnalysisLanguageQualityError(
      `Trường ${field} không đạt chuẩn nội dung hiển thị.`,
    );
  }

  return normalized;
}

function normalizeVietnameseSentence(
  value: string,
  field: string,
  maxLength: number,
): string {
  let normalized = normalizeVisibleText(value, field, maxLength);
  if (!ACCENTED_LATIN.test(normalized)) {
    throw new ProjectAnalysisLanguageQualityError(
      `Trường ${field} chưa đạt chuẩn tiếng Việt có dấu.`,
    );
  }
  if (!TERMINAL_PUNCTUATION.test(normalized)) {
    normalized = `${normalized}.`;
  }
  return normalized;
}

function countSentences(value: string): number {
  return value.match(SENTENCE_BOUNDARY)?.length ?? 0;
}

function normalizeRecommendation(value: string): string {
  const normalized = normalizeVietnameseSentence(
    value,
    "recommendation",
    800,
  );
  const sentenceCount = countSentences(normalized);
  if (
    sentenceCount < 2 ||
    sentenceCount > 4 ||
    ROBOTIC_ACKNOWLEDGEMENT.test(normalized)
  ) {
    throw new ProjectAnalysisLanguageQualityError(
      "Recommendation phải gồm 2–4 câu tự nhiên, có nội dung kỹ thuật cụ thể và không dùng xác nhận dập khuôn.",
    );
  }
  return normalized;
}

function normalizeOption(
  option: ProjectAnalysisOption,
  index: number,
): ProjectAnalysisOption {
  const name = normalizeVisibleText(option.name, `options[${index}].name`, 100);
  if (name.length < 3 || GENERIC_OPTION_NAME.test(name)) {
    throw new ProjectAnalysisLanguageQualityError(
      `Tên options[${index}] chưa đủ mô tả.`,
    );
  }

  return {
    name,
    suitableWhen: normalizeVietnameseSentence(
      option.suitableWhen,
      `options[${index}].suitableWhen`,
      300,
    ),
    tradeoffs: option.tradeoffs.map((item, tradeoffIndex) =>
      normalizeVietnameseSentence(
        item,
        `options[${index}].tradeoffs[${tradeoffIndex}]`,
        220,
      ),
    ),
  };
}

export function assertProjectAnalysisLanguageQuality(
  analysis: ProjectAnalysisContent,
): ProjectAnalysisContent {
  return {
    summary: normalizeVietnameseSentence(analysis.summary, "summary", 600),
    recommendation: normalizeRecommendation(analysis.recommendation),
    options: analysis.options.map(normalizeOption),
    surveyChecks: analysis.surveyChecks.map((item, index) =>
      normalizeVietnameseSentence(item, `surveyChecks[${index}]`, 220),
    ),
    limitations: analysis.limitations.map((item, index) =>
      normalizeVietnameseSentence(item, `limitations[${index}]`, 220),
    ),
  };
}
