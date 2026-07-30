export const AI_SERVICES = [
  "Cửa cổng",
  "Cầu thang và lan can",
  "Mái che",
  "Nội thất",
  "Cải tạo không gian",
] as const;

export type AIService = (typeof AI_SERVICES)[number];

const AI_SERVICE_SET = new Set<string>(AI_SERVICES);

export function isAIService(value: unknown): value is AIService {
  return typeof value === "string" && AI_SERVICE_SET.has(value);
}

export function getAIService(value: string | null | undefined): AIService | null {
  return isAIService(value) ? value : null;
}
