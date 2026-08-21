import type { ConfirmedSpaceEnvelope } from "@/lib/ai/space-confirmation";
import type { StrictLayoutProposal } from "@/lib/ai/space-layout-gate";
import {
  isAllowedProjectImageMimeType,
  type ProjectImageMimeType,
} from "@/lib/ai/image-upload";

export const SPACE_RENDER_ARTIFACT_CLASS = "concept-presentation" as const;
export const SPACE_RENDER_ENGINEERING_STATUS = "not-engineer-verified" as const;
export const SPACE_RENDER_MAX_IMAGE_BYTES = 2_200_000;
export const SPACE_RENDER_MAX_TOTAL_IMAGE_BYTES = 4_400_000;
export const SPACE_RENDER_MAX_STYLE_CHARS = 2_000;

const MAX_RENDER_PROMPT_CHARS = 64_000;
const STRICT_BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

type UnknownRecord = Record<string, unknown>;

export interface SpaceRenderImage {
  mimeType: ProjectImageMimeType;
  dataBase64: string;
}

export interface SpaceRenderRequest {
  confirmed: unknown;
  proposal: unknown;
  siteImage: SpaceRenderImage;
  referenceImage?: SpaceRenderImage;
  styleIntent: string;
}

export type SpaceRenderErrorCode =
  | "INVALID_RENDER_REQUEST"
  | "INVALID_RENDER_IMAGE"
  | "RENDER_IMAGE_TOO_LARGE"
  | "INVALID_STYLE_INTENT"
  | "RENDER_PROMPT_TOO_LARGE";

export class SpaceRenderError extends Error {
  readonly code: SpaceRenderErrorCode;

  constructor(message: string, code: SpaceRenderErrorCode) {
    super(message);
    this.name = "SpaceRenderError";
    this.code = code;
  }
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

function decodedBase64Bytes(value: string): number {
  const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
  return (value.length / 4) * 3 - padding;
}

function parseImage(value: unknown, label: string): SpaceRenderImage {
  const image = asRecord(value);
  if (
    !image ||
    !hasOnlyKeys(image, ["mimeType", "dataBase64"]) ||
    !isAllowedProjectImageMimeType(image.mimeType) ||
    typeof image.dataBase64 !== "string" ||
    !image.dataBase64 ||
    image.dataBase64.length % 4 !== 0 ||
    !STRICT_BASE64_PATTERN.test(image.dataBase64)
  ) {
    throw new SpaceRenderError(
      `${label} phải là ảnh JPG, PNG hoặc WebP hợp lệ.`,
      "INVALID_RENDER_IMAGE",
    );
  }

  const bytes = decodedBase64Bytes(image.dataBase64);
  if (bytes <= 0 || bytes > SPACE_RENDER_MAX_IMAGE_BYTES) {
    throw new SpaceRenderError(
      `${label} vượt quá giới hạn dung lượng cho phép.`,
      "RENDER_IMAGE_TOO_LARGE",
    );
  }

  return {
    mimeType: image.mimeType,
    dataBase64: image.dataBase64,
  };
}

export function parseSpaceRenderRequest(input: unknown): SpaceRenderRequest {
  const request = asRecord(input);
  if (
    !request ||
    !hasOnlyKeys(request, [
      "confirmed",
      "proposal",
      "siteImage",
      "referenceImage",
      "styleIntent",
    ]) ||
    !("confirmed" in request) ||
    !("proposal" in request) ||
    !("siteImage" in request)
  ) {
    throw new SpaceRenderError(
      "Yêu cầu render không gian không hợp lệ.",
      "INVALID_RENDER_REQUEST",
    );
  }

  const siteImage = parseImage(request.siteImage, "Ảnh hiện trạng");
  const referenceImage =
    request.referenceImage === undefined
      ? undefined
      : parseImage(request.referenceImage, "Ảnh tham khảo");
  const totalImageBytes =
    decodedBase64Bytes(siteImage.dataBase64) +
    (referenceImage ? decodedBase64Bytes(referenceImage.dataBase64) : 0);
  if (totalImageBytes > SPACE_RENDER_MAX_TOTAL_IMAGE_BYTES) {
    throw new SpaceRenderError(
      "Tổng dung lượng ảnh render vượt quá giới hạn.",
      "RENDER_IMAGE_TOO_LARGE",
    );
  }

  const rawStyle = request.styleIntent ?? "";
  if (
    typeof rawStyle !== "string" ||
    rawStyle.length > SPACE_RENDER_MAX_STYLE_CHARS ||
    rawStyle.includes("\u0000")
  ) {
    throw new SpaceRenderError(
      "Mô tả phong cách render không hợp lệ.",
      "INVALID_STYLE_INTENT",
    );
  }

  return {
    confirmed: request.confirmed,
    proposal: request.proposal,
    siteImage,
    ...(referenceImage ? { referenceImage } : {}),
    styleIntent: rawStyle.trim(),
  };
}

function geometryPayload(confirmed: ConfirmedSpaceEnvelope) {
  return {
    schemaVersion: confirmed.model.schemaVersion,
    unit: confirmed.model.unit,
    confirmedRevision: confirmed.confirmedRevision,
    rooms: confirmed.model.rooms,
    structuralElements: confirmed.model.structuralElements,
  };
}

function layoutPayload(proposal: StrictLayoutProposal) {
  return {
    baseRevision: proposal.baseRevision,
    placements: proposal.placements,
  };
}

export function buildSpaceRenderPrompt(
  confirmed: ConfirmedSpaceEnvelope,
  proposal: StrictLayoutProposal,
  styleIntent: string,
  hasReferenceImage: boolean,
): string {
  const style = styleIntent.trim();
  const prompt = [
    "Bạn là render adapter G6 của DHP AI Space Designer.",
    "Ảnh đầu vào 1 là ảnh hiện trạng và là CAMERA ANCHOR bắt buộc.",
    hasReferenceImage
      ? "Ảnh đầu vào 2 chỉ là tham khảo phong cách/vật liệu; không được dùng để thay geometry hoặc camera của ảnh hiện trạng."
      : "Không có ảnh tham khảo phong cách riêng; chỉ dùng mô tả phong cách nếu được cung cấp.",
    "MỤC TIÊU: tạo đúng một ảnh concept/presentation photorealistic 16:9 thể hiện layout G5 đã được deterministic gate chấp nhận.",
    "KHÓA CAMERA: giữ nguyên góc máy, vị trí camera, đường chân trời, điểm tụ, crop, perspective và tỷ lệ không gian của ảnh hiện trạng; không camera drift.",
    "KHÓA GEOMETRY: không di chuyển, resize, xóa, bịa hoặc reinterpret tường, cột, sàn, trần, cửa, cửa sổ, shaft hoặc fixed fixture. Không sửa HARD/CONTROLLED geometry.",
    "LAYOUT: chỉ thêm/biểu diễn các placement đã được duyệt trong LAYOUT_G5. Không thêm đồ nội thất chính ngoài danh sách, không đổi roomId và không thay tọa độ thiết kế để né ràng buộc.",
    "Không chèn kích thước, chữ, logo, watermark, người hoặc xe. Không biến ảnh render thành bản vẽ kỹ thuật hoặc báo giá.",
    "Vật liệu/màu sắc trong render chỉ là trình bày ý tưởng nếu chưa được DHP verified data xác nhận; không được ngụ ý đây là cấu tạo/kích thước thi công đã được kỹ sư duyệt.",
    style
      ? `PHONG CÁCH TRÌNH BÀY (không có quyền sửa geometry): ${style}`
      : "PHONG CÁCH TRÌNH BÀY: sạch, hiện đại, vật liệu chân thực, ánh sáng tự nhiên; không thay đổi geometry.",
    "GEOMETRY_CONFIRMED:",
    JSON.stringify(geometryPayload(confirmed)),
    "LAYOUT_G5:",
    JSON.stringify(layoutPayload(proposal)),
  ].join("\n");

  if (prompt.length > MAX_RENDER_PROMPT_CHARS) {
    throw new SpaceRenderError(
      "Geometry/layout quá lớn để render an toàn trong một lần.",
      "RENDER_PROMPT_TOO_LARGE",
    );
  }
  return prompt;
}
