import type { ConfirmedSpaceEnvelope } from "@/lib/ai/space-confirmation";

const MAX_LAYOUT_INTENT_CHARS = 2_000;
const MAX_LAYOUT_OUTPUT_CHARS = 64 * 1024;
const MAX_LAYOUT_PROMPT_CHARS = 60_000;

type UnknownRecord = Record<string, unknown>;

export type SpaceLayoutGenerationErrorCode =
  | "INVALID_LAYOUT_GENERATION_REQUEST"
  | "INVALID_LAYOUT_INTENT"
  | "LAYOUT_PROMPT_TOO_LARGE"
  | "INVALID_LAYOUT_MODEL_OUTPUT";

export class SpaceLayoutGenerationError extends Error {
  readonly code: SpaceLayoutGenerationErrorCode;

  constructor(message: string, code: SpaceLayoutGenerationErrorCode) {
    super(message);
    this.name = "SpaceLayoutGenerationError";
    this.code = code;
  }
}

export interface SpaceLayoutGenerationRequest {
  confirmed: unknown;
  intent: string;
}

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function hasOnlyKeys(record: UnknownRecord, allowed: readonly string[]): boolean {
  const allowedSet = new Set(allowed);
  return Object.keys(record).every((key) => allowedSet.has(key));
}

function normalizeIntent(value: unknown): string {
  if (typeof value !== "string") {
    throw new SpaceLayoutGenerationError(
      "Ý định bố trí phải là văn bản.",
      "INVALID_LAYOUT_INTENT",
    );
  }

  const intent = value.trim();
  if (!intent || intent.length > MAX_LAYOUT_INTENT_CHARS || intent.includes("\u0000")) {
    throw new SpaceLayoutGenerationError(
      "Ý định bố trí trống hoặc vượt quá giới hạn cho phép.",
      "INVALID_LAYOUT_INTENT",
    );
  }
  return intent;
}

export function parseSpaceLayoutGenerationRequest(
  input: unknown,
): SpaceLayoutGenerationRequest {
  const request = asRecord(input);
  if (
    !request ||
    !hasOnlyKeys(request, ["confirmed", "intent"]) ||
    !("confirmed" in request)
  ) {
    throw new SpaceLayoutGenerationError(
      "Yêu cầu sinh layout không hợp lệ.",
      "INVALID_LAYOUT_GENERATION_REQUEST",
    );
  }

  return {
    confirmed: request.confirmed,
    intent: normalizeIntent(request.intent),
  };
}

function layoutGeometryPayload(confirmed: ConfirmedSpaceEnvelope) {
  return {
    schemaVersion: confirmed.model.schemaVersion,
    unit: confirmed.model.unit,
    confirmedRevision: confirmed.confirmedRevision,
    rooms: confirmed.model.rooms,
    structuralElements: confirmed.model.structuralElements,
  };
}

export function buildSpaceLayoutGenerationPrompt(
  confirmed: ConfirmedSpaceEnvelope,
  intentInput: string,
): string {
  const intent = normalizeIntent(intentInput);
  const geometry = JSON.stringify(layoutGeometryPayload(confirmed));
  const prompt = [
    "Bạn là DHP Space Layout Planner ở gate G5.",
    "Nhiệm vụ duy nhất: tạo một layout candidate trong geometry đã được người dùng xác nhận.",
    "TUYỆT ĐỐI không sửa, dịch chuyển, resize hoặc xóa tường, cột, cửa, cửa sổ, shaft hay fixed fixture.",
    `baseRevision phải chính xác là: ${confirmed.confirmedRevision}`,
    "structuralEdits bắt buộc là mảng rỗng [].",
    "Mọi placement dùng hệ tọa độ mm, bounds hình chữ nhật axis-aligned {x,y,width,depth}.",
    "Mỗi placement phải nằm hoàn toàn trong polygon của đúng roomId, không đè structural element blocksPlacement=true và không chồng placement khác kể cả clearanceMm.",
    "Không bịa roomId. clearanceMm nếu có phải >= 0. Ưu tiên lối đi và khoảng mở cửa hợp lý.",
    "Chỉ trả về đúng một JSON object trực tiếp, không Markdown, không giải thích, không wrapper.",
    "JSON schema bắt buộc:",
    '{"baseRevision":"string","structuralEdits":[],"placements":[{"id":"string","roomId":"string","kind":"string","bounds":{"x":0,"y":0,"width":1,"depth":1},"clearanceMm":0}]}',
    "Ý định thiết kế của người dùng:",
    intent,
    "GEOMETRY_CONFIRMED:",
    geometry,
  ].join("\n");

  if (prompt.length > MAX_LAYOUT_PROMPT_CHARS) {
    throw new SpaceLayoutGenerationError(
      "Geometry đã xác nhận quá lớn để sinh layout an toàn trong một lần.",
      "LAYOUT_PROMPT_TOO_LARGE",
    );
  }
  return prompt;
}

export function parseSpaceLayoutGenerationOutput(outputText: string): unknown {
  if (
    typeof outputText !== "string" ||
    !outputText.trim() ||
    outputText.length > MAX_LAYOUT_OUTPUT_CHARS
  ) {
    throw new SpaceLayoutGenerationError(
      "Model layout trả về dữ liệu trống hoặc vượt giới hạn.",
      "INVALID_LAYOUT_MODEL_OUTPUT",
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(outputText);
  } catch {
    throw new SpaceLayoutGenerationError(
      "Model layout không trả về JSON hợp lệ.",
      "INVALID_LAYOUT_MODEL_OUTPUT",
    );
  }

  if (!asRecord(parsed)) {
    throw new SpaceLayoutGenerationError(
      "Model layout phải trả về một JSON object trực tiếp.",
      "INVALID_LAYOUT_MODEL_OUTPUT",
    );
  }
  return parsed;
}
