import {
  AI_CONCEPT_MODEL,
} from "@/lib/ai/concept-studio";
import {
  isAllowedProjectImageMimeType,
  type ProjectImageMimeType,
} from "@/lib/ai/image-upload";

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${AI_CONCEPT_MODEL}:generateContent`;
const UPSTREAM_TIMEOUT_MS = 105_000;
const MAX_PROMPT_CHARS = 64_000;
const MAX_IMAGE_BYTES = 2_200_000;
const MAX_TOTAL_IMAGE_BYTES = 6_000_000;
const MAX_IMAGES = 3;
const MAX_ERROR_RESPONSE_BYTES = 8 * 1024;
const STRICT_BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export interface ConceptRenderImage {
  mimeType: ProjectImageMimeType;
  dataBase64: string;
}

export type ConceptRenderAdapterErrorCode =
  | "configuration"
  | "rate_limit"
  | "timeout"
  | "upstream"
  | "invalid_input"
  | "invalid_output";

export class ConceptRenderAdapterError extends Error {
  constructor(
    message: string,
    readonly code: ConceptRenderAdapterErrorCode,
    readonly upstreamHttpStatus: number | null = null,
    readonly upstreamStatus: string | null = null,
  ) {
    super(message);
    this.name = "ConceptRenderAdapterError";
  }
}

export interface ConceptRenderResult {
  imageBase64: string;
  mimeType: string;
  model: typeof AI_CONCEPT_MODEL;
}

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: unknown;
        inlineData?: {
          mimeType?: unknown;
          data?: unknown;
        };
      }>;
    };
    finishReason?: unknown;
  }>;
}

function decodedBase64Bytes(value: string): number {
  const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
  return (value.length / 4) * 3 - padding;
}

function validateInput(prompt: string, images: readonly ConceptRenderImage[]): void {
  if (!prompt.trim() || prompt.length > MAX_PROMPT_CHARS) {
    throw new ConceptRenderAdapterError(
      "Render prompt trống hoặc vượt giới hạn.",
      "invalid_input",
    );
  }
  if (images.length === 0 || images.length > MAX_IMAGES) {
    throw new ConceptRenderAdapterError(
      "Số lượng ảnh đầu vào không hợp lệ.",
      "invalid_input",
    );
  }

  let totalBytes = 0;
  for (const image of images) {
    if (
      !isAllowedProjectImageMimeType(image.mimeType) ||
      !image.dataBase64 ||
      image.dataBase64.length % 4 !== 0 ||
      !STRICT_BASE64_PATTERN.test(image.dataBase64)
    ) {
      throw new ConceptRenderAdapterError(
        "Ảnh render không đúng định dạng.",
        "invalid_input",
      );
    }
    const bytes = decodedBase64Bytes(image.dataBase64);
    if (bytes <= 0 || bytes > MAX_IMAGE_BYTES) {
      throw new ConceptRenderAdapterError(
        "Ảnh render vượt quá giới hạn dung lượng.",
        "invalid_input",
      );
    }
    totalBytes += bytes;
  }

  if (totalBytes > MAX_TOTAL_IMAGE_BYTES) {
    throw new ConceptRenderAdapterError(
      "Tổng dung lượng ảnh render vượt quá giới hạn.",
      "invalid_input",
    );
  }
}

async function readUpstreamError(response: Response): Promise<string | null> {
  try {
    const text = await response.text();
    if (!text || text.length > MAX_ERROR_RESPONSE_BYTES) return null;
    const payload = JSON.parse(text) as {
      error?: { status?: unknown; message?: unknown };
    };
    const status = payload.error?.status;
    return typeof status === "string" ? status.slice(0, 64) : null;
  } catch {
    return null;
  }
}

export function isConceptRenderConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export async function renderConceptPresentation(input: {
  prompt: string;
  images: readonly ConceptRenderImage[];
}): Promise<ConceptRenderResult> {
  validateInput(input.prompt, input.images);

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new ConceptRenderAdapterError(
      "Concept render adapter chưa được cấu hình.",
      "configuration",
    );
  }

  const parts: Array<Record<string, unknown>> = [
    { text: input.prompt },
    ...input.images.map((image) => ({
      inline_data: {
        mime_type: image.mimeType,
        data: image.dataBase64,
      },
    })),
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          responseFormat: {
            image: {
              aspectRatio: "16:9",
              imageSize: "1K",
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const upstreamStatus = await readUpstreamError(response);
      throw new ConceptRenderAdapterError(
        response.status === 429
          ? "Dịch vụ tạo ảnh đang bận. Vui lòng thử lại sau."
          : "Chưa thể tạo phối cảnh. Vui lòng thử lại.",
        response.status === 429 ? "rate_limit" : "upstream",
        response.status,
        upstreamStatus,
      );
    }

    const payload = (await response.json()) as GeminiGenerateResponse;
    const imagePart = payload.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .find(
        (part) =>
          typeof part.inlineData?.data === "string" &&
          typeof part.inlineData?.mimeType === "string" &&
          part.inlineData.mimeType.startsWith("image/"),
      );

    if (
      typeof imagePart?.inlineData?.data !== "string" ||
      typeof imagePart.inlineData.mimeType !== "string"
    ) {
      throw new ConceptRenderAdapterError(
        "Render provider không trả về ảnh hợp lệ.",
        "invalid_output",
      );
    }

    return {
      imageBase64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
      model: AI_CONCEPT_MODEL,
    };
  } catch (error) {
    if (error instanceof ConceptRenderAdapterError) throw error;
    if (controller.signal.aborted) {
      throw new ConceptRenderAdapterError(
        "Quá trình dựng phối cảnh phản hồi quá lâu.",
        "timeout",
      );
    }
    throw new ConceptRenderAdapterError(
      "Concept render adapter tạm thời không khả dụng.",
      "upstream",
    );
  } finally {
    clearTimeout(timeout);
  }
}
