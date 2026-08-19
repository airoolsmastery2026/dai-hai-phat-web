import {
  isAllowedProjectImageMimeType,
  type ProjectImageMimeType,
} from "@/lib/ai/image-upload";
import {
  SPACE_MODEL_SCHEMA_VERSION,
  SPACE_MODEL_UNIT,
  type SpaceBounds,
  type SpaceModel,
  type SpacePoint,
  type SpaceRoom,
  type SpaceStructuralElement,
  type StructuralElementKind,
  validateSpaceModel,
} from "@/lib/ai/space-designer";

export const SPACE_EXTRACTION_MAX_IMAGE_BYTES = 2_621_440;
export const SPACE_EXTRACTION_MAX_CONTEXT_CHARS = 2_000;

const MAX_AI_OUTPUT_CHARS = 128_000;
const MAX_REASON_ITEMS = 20;
const MAX_ASSUMPTION_ITEMS = 40;
const MAX_DIMENSION_EVIDENCE = 100;
const MAX_TEXT_ITEM_CHARS = 500;
const STRICT_BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

type UnknownRecord = Record<string, unknown>;

export type SpaceExtractionValidationCode =
  | "INVALID_REQUEST"
  | "INVALID_IMAGE_TYPE"
  | "INVALID_IMAGE_DATA"
  | "IMAGE_TOO_LARGE"
  | "CONTEXT_TOO_LONG";

export type SpaceExtractionOutputCode =
  | "INVALID_AI_OUTPUT"
  | "UNTRUSTED_CONTROL_FIELD"
  | "MISSING_DIMENSION_EVIDENCE"
  | "INVALID_SPACE_MODEL";

export class SpaceExtractionValidationError extends Error {
  readonly code: SpaceExtractionValidationCode;

  constructor(message: string, code: SpaceExtractionValidationCode) {
    super(message);
    this.name = "SpaceExtractionValidationError";
    this.code = code;
  }
}

export class SpaceExtractionOutputError extends Error {
  readonly code: SpaceExtractionOutputCode;

  constructor(message: string, code: SpaceExtractionOutputCode) {
    super(message);
    this.name = "SpaceExtractionOutputError";
    this.code = code;
  }
}

export interface SpaceExtractionImage {
  mimeType: ProjectImageMimeType;
  dataBase64: string;
}

export interface SpaceExtractionRequest {
  image: SpaceExtractionImage;
  context: string;
}

export interface SpaceDimensionEvidence {
  label: string;
  valueMm: number;
  source: "visible-label";
}

export interface SpaceCandidateVerification {
  geometryStatus: "candidate-unverified";
  dimensionStatus: "unverified-ai-extraction";
  dimensionEvidence: SpaceDimensionEvidence[];
  assumptions: string[];
}

export type SpaceExtractionResult =
  | {
      status: "candidate";
      candidate: {
        model: SpaceModel;
        verification: SpaceCandidateVerification;
      };
    }
  | {
      status: "insufficient-evidence";
      reasons: string[];
      assumptions: string[];
    };

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function decodedBase64Bytes(value: string): number {
  const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
  return (value.length / 4) * 3 - padding;
}

function isStrictBase64(value: string): boolean {
  return (
    value.length > 0 &&
    value.length % 4 === 0 &&
    STRICT_BASE64_PATTERN.test(value)
  );
}

function readStringList(
  value: unknown,
  field: string,
  maxItems: number,
): string[] {
  if (!Array.isArray(value) || value.length > maxItems) {
    throw new SpaceExtractionOutputError(
      `${field} không đúng định dạng.`,
      "INVALID_AI_OUTPUT",
    );
  }
  return value.map((item) => {
    if (
      typeof item !== "string" ||
      !item.trim() ||
      item.length > MAX_TEXT_ITEM_CHARS
    ) {
      throw new SpaceExtractionOutputError(
        `${field} chứa dữ liệu không hợp lệ.`,
        "INVALID_AI_OUTPUT",
      );
    }
    return item.trim();
  });
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readPoint(value: unknown): SpacePoint | null {
  const record = asRecord(value);
  if (!record) return null;
  const x = readFiniteNumber(record.x);
  const y = readFiniteNumber(record.y);
  return x === null || y === null ? null : { x, y };
}

function readBounds(value: unknown): SpaceBounds | null {
  const record = asRecord(value);
  if (!record) return null;
  const x = readFiniteNumber(record.x);
  const y = readFiniteNumber(record.y);
  const width = readFiniteNumber(record.width);
  const depth = readFiniteNumber(record.depth);
  if (x === null || y === null || width === null || depth === null) return null;
  return { x, y, width, depth };
}

function readRooms(value: unknown): SpaceRoom[] {
  if (!Array.isArray(value)) {
    throw new SpaceExtractionOutputError(
      "AI output thiếu rooms.",
      "INVALID_AI_OUTPUT",
    );
  }
  return value.map((item) => {
    const room = asRecord(item);
    if (
      !room ||
      typeof room.id !== "string" ||
      typeof room.type !== "string" ||
      !Array.isArray(room.polygon)
    ) {
      throw new SpaceExtractionOutputError(
        "AI output chứa room không hợp lệ.",
        "INVALID_AI_OUTPUT",
      );
    }
    const polygon = room.polygon.map(readPoint);
    if (polygon.some((point) => point === null)) {
      throw new SpaceExtractionOutputError(
        "AI output chứa polygon không hợp lệ.",
        "INVALID_AI_OUTPUT",
      );
    }
    return {
      id: room.id,
      type: room.type,
      polygon: polygon as SpacePoint[],
    };
  });
}

function structuralPolicy(kind: StructuralElementKind): {
  lock: "hard" | "controlled";
  blocksPlacement: boolean;
} {
  switch (kind) {
    case "wall":
    case "column":
    case "shaft":
      return { lock: "hard", blocksPlacement: true };
    case "window":
      return { lock: "controlled", blocksPlacement: false };
    case "door":
    case "fixed-fixture":
      return { lock: "controlled", blocksPlacement: true };
  }
}

function readStructuralElements(value: unknown): SpaceStructuralElement[] {
  if (!Array.isArray(value)) {
    throw new SpaceExtractionOutputError(
      "AI output thiếu structuralElements.",
      "INVALID_AI_OUTPUT",
    );
  }

  const allowedKinds = new Set<StructuralElementKind>([
    "wall",
    "column",
    "door",
    "window",
    "shaft",
    "fixed-fixture",
  ]);

  return value.map((item) => {
    const element = asRecord(item);
    if (!element) {
      throw new SpaceExtractionOutputError(
        "AI output chứa structural element không hợp lệ.",
        "INVALID_AI_OUTPUT",
      );
    }
    if (
      "lock" in element ||
      "blocksPlacement" in element ||
      "approved" in element
    ) {
      throw new SpaceExtractionOutputError(
        "AI không được điều khiển geometry lock hoặc approval.",
        "UNTRUSTED_CONTROL_FIELD",
      );
    }
    if (
      typeof element.id !== "string" ||
      typeof element.kind !== "string" ||
      !allowedKinds.has(element.kind as StructuralElementKind)
    ) {
      throw new SpaceExtractionOutputError(
        "AI output chứa structural element không hợp lệ.",
        "INVALID_AI_OUTPUT",
      );
    }
    if (element.roomId !== undefined && typeof element.roomId !== "string") {
      throw new SpaceExtractionOutputError(
        "AI output chứa roomId không hợp lệ.",
        "INVALID_AI_OUTPUT",
      );
    }
    const bounds = readBounds(element.bounds);
    if (!bounds) {
      throw new SpaceExtractionOutputError(
        "AI output chứa structural bounds không hợp lệ.",
        "INVALID_AI_OUTPUT",
      );
    }
    const kind = element.kind as StructuralElementKind;
    return {
      id: element.id,
      ...(element.roomId === undefined ? {} : { roomId: element.roomId }),
      kind,
      bounds,
      ...structuralPolicy(kind),
    };
  });
}

function readDimensionEvidence(value: unknown): SpaceDimensionEvidence[] {
  if (!Array.isArray(value) || value.length > MAX_DIMENSION_EVIDENCE) {
    throw new SpaceExtractionOutputError(
      "dimensionEvidence không đúng định dạng.",
      "INVALID_AI_OUTPUT",
    );
  }
  return value.map((item) => {
    const evidence = asRecord(item);
    if (
      !evidence ||
      typeof evidence.label !== "string" ||
      !evidence.label.trim() ||
      evidence.label.length > MAX_TEXT_ITEM_CHARS ||
      evidence.source !== "visible-label" ||
      typeof evidence.valueMm !== "number" ||
      !Number.isFinite(evidence.valueMm) ||
      evidence.valueMm <= 0
    ) {
      throw new SpaceExtractionOutputError(
        "dimensionEvidence chứa dữ liệu không hợp lệ.",
        "INVALID_AI_OUTPUT",
      );
    }
    return {
      label: evidence.label.trim(),
      valueMm: evidence.valueMm,
      source: "visible-label",
    };
  });
}

export function parseSpaceExtractionRequest(
  input: unknown,
): SpaceExtractionRequest {
  const request = asRecord(input);
  const image = asRecord(request?.image);
  if (!request || !image) {
    throw new SpaceExtractionValidationError(
      "Yêu cầu trích xuất không gian không hợp lệ.",
      "INVALID_REQUEST",
    );
  }

  if (!isAllowedProjectImageMimeType(image.mimeType)) {
    throw new SpaceExtractionValidationError(
      "Ảnh phải là JPG, PNG hoặc WebP.",
      "INVALID_IMAGE_TYPE",
    );
  }
  if (
    typeof image.dataBase64 !== "string" ||
    !isStrictBase64(image.dataBase64)
  ) {
    throw new SpaceExtractionValidationError(
      "Dữ liệu ảnh base64 không hợp lệ.",
      "INVALID_IMAGE_DATA",
    );
  }
  if (decodedBase64Bytes(image.dataBase64) > SPACE_EXTRACTION_MAX_IMAGE_BYTES) {
    throw new SpaceExtractionValidationError(
      "Ảnh dùng để đọc mặt bằng vượt quá giới hạn 2,5 MB.",
      "IMAGE_TOO_LARGE",
    );
  }

  const context = request.context ?? "";
  if (typeof context !== "string") {
    throw new SpaceExtractionValidationError(
      "Ngữ cảnh bổ sung không hợp lệ.",
      "INVALID_REQUEST",
    );
  }
  if (context.length > SPACE_EXTRACTION_MAX_CONTEXT_CHARS) {
    throw new SpaceExtractionValidationError(
      `Ngữ cảnh bổ sung không được vượt quá ${SPACE_EXTRACTION_MAX_CONTEXT_CHARS} ký tự.`,
      "CONTEXT_TOO_LONG",
    );
  }

  return {
    image: {
      mimeType: image.mimeType,
      dataBase64: image.dataBase64,
    },
    context: context.trim(),
  };
}

export function buildSpaceExtractionPrompt(context = ""): string {
  const supplemental = context.trim()
    ? `\nNGỮ CẢNH BỔ SUNG TỪ NGƯỜI DÙNG (không phải dữ liệu đã xác minh):\n${context.trim()}`
    : "";

  return [
    "Bạn đang thực hiện bước G3: đọc một ảnh mặt bằng thành candidate geometry cho DHP AI Space Designer.",
    "Chỉ phân tích thông tin không gian nhìn thấy trong ảnh; không suy đoán danh tính, địa chỉ hoặc dữ liệu cá nhân.",
    "Không được tự bịa kích thước, tỷ lệ, tường, cửa, cửa sổ hoặc phòng không có đủ bằng chứng trực quan.",
    "Nếu ảnh không có nhãn kích thước nhìn thấy rõ để thiết lập hình học theo mm, trả status=insufficient-evidence thay vì ước lượng.",
    "Mọi kích thước dùng để dựng geometry phải có dimensionEvidence source=visible-label.",
    "Output candidate vẫn là dữ liệu chưa xác minh; không đưa ra tuyên bố kỹ thuật/thi công đã được xác nhận.",
    "Không trả các trường lock, blocksPlacement, approved hoặc bất kỳ quyền điều khiển geometry nào; server sẽ áp chính sách khóa.",
    "Không báo giá, không suy đoán vật liệu/nhà cung cấp, không tạo BOQ và không đưa ra quyết định kết cấu.",
    "Tọa độ candidate dùng mm và chỉ được suy ra khi nhãn kích thước nhìn thấy đủ để thiết lập tỷ lệ. Giữ hình học đơn giản, nhất quán và không tự cắt.",
    "Chỉ trả về một JSON object hợp lệ, không Markdown, theo một trong hai dạng:",
    '{"status":"candidate","unit":"mm","rooms":[{"id":"room-...","type":"...","polygon":[{"x":0,"y":0},{"x":4200,"y":0},{"x":4200,"y":3600},{"x":0,"y":3600}]}],"structuralElements":[{"id":"wall-...","roomId":"room-...","kind":"wall","bounds":{"x":0,"y":0,"width":4200,"depth":100}}],"dimensionEvidence":[{"label":"4200","valueMm":4200,"source":"visible-label"},{"label":"3600","valueMm":3600,"source":"visible-label"}],"assumptions":[]}',
    'HOẶC {"status":"insufficient-evidence","reasons":["Không thấy đủ nhãn kích thước để thiết lập geometry theo mm."],"assumptions":[]}',
    supplemental,
  ].join("\n");
}

export function parseSpaceExtractionOutput(
  outputText: string,
  revision: string,
): SpaceExtractionResult {
  if (!outputText || outputText.length > MAX_AI_OUTPUT_CHARS) {
    throw new SpaceExtractionOutputError(
      "AI output trống hoặc vượt giới hạn.",
      "INVALID_AI_OUTPUT",
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(outputText) as unknown;
  } catch {
    throw new SpaceExtractionOutputError(
      "AI không trả về JSON hợp lệ.",
      "INVALID_AI_OUTPUT",
    );
  }

  const payload = asRecord(parsed);
  if (!payload || typeof payload.status !== "string") {
    throw new SpaceExtractionOutputError(
      "AI output thiếu status.",
      "INVALID_AI_OUTPUT",
    );
  }

  if (payload.status === "insufficient-evidence") {
    const reasons = readStringList(
      payload.reasons,
      "reasons",
      MAX_REASON_ITEMS,
    );
    if (reasons.length === 0) {
      throw new SpaceExtractionOutputError(
        "insufficient-evidence phải nêu ít nhất một lý do.",
        "INVALID_AI_OUTPUT",
      );
    }
    return {
      status: "insufficient-evidence",
      reasons,
      assumptions: readStringList(
        payload.assumptions ?? [],
        "assumptions",
        MAX_ASSUMPTION_ITEMS,
      ),
    };
  }

  if (payload.status !== "candidate" || payload.unit !== SPACE_MODEL_UNIT) {
    throw new SpaceExtractionOutputError(
      "AI output candidate không đúng schema.",
      "INVALID_AI_OUTPUT",
    );
  }

  const dimensionEvidence = readDimensionEvidence(payload.dimensionEvidence);
  if (dimensionEvidence.length === 0) {
    throw new SpaceExtractionOutputError(
      "Candidate geometry thiếu bằng chứng kích thước nhìn thấy.",
      "MISSING_DIMENSION_EVIDENCE",
    );
  }

  const model: SpaceModel = {
    schemaVersion: SPACE_MODEL_SCHEMA_VERSION,
    unit: SPACE_MODEL_UNIT,
    revision,
    rooms: readRooms(payload.rooms),
    structuralElements: readStructuralElements(payload.structuralElements),
  };

  const modelReport = validateSpaceModel(model);
  if (!modelReport.valid) {
    throw new SpaceExtractionOutputError(
      `Candidate Space Model không vượt qua G1: ${modelReport.issues
        .map((issue) => issue.code)
        .join(", ")}`,
      "INVALID_SPACE_MODEL",
    );
  }

  return {
    status: "candidate",
    candidate: {
      model,
      verification: {
        geometryStatus: "candidate-unverified",
        dimensionStatus: "unverified-ai-extraction",
        dimensionEvidence,
        assumptions: readStringList(
          payload.assumptions ?? [],
          "assumptions",
          MAX_ASSUMPTION_ITEMS,
        ),
      },
    },
  };
}
