import { buildWorkspaceChatPrompt } from "@/lib/server/openai-compatible-llm";
import {
  ModelRuntimeCapabilityError,
  runWorkspaceChatWithModelRuntimeCapability,
} from "@/lib/server/model-runtime-capability";

export const dynamic = "force-dynamic";

const MAX_MESSAGE_CHARS = 12_000;

function errorResponse(message: string, code: string, status: number): Response {
  return Response.json(
    { error: message, code },
    {
      status,
      headers: {
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    },
  );
}

function runtimeErrorResponse(error: ModelRuntimeCapabilityError): Response {
  switch (error.code) {
    case "configuration":
      return errorResponse(error.message, "zero_cost_provider_not_configured", 503);
    case "rate_limit":
      return errorResponse(error.message, "zero_cost_quota_limited", 429);
    case "timeout":
      return errorResponse(error.message, "model_runtime_timeout", 504);
    case "invalid_output":
      return errorResponse(error.message, "invalid_model_output", 502);
    default:
      return errorResponse(error.message, "model_runtime_unavailable", 502);
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Dữ liệu gửi lên không phải JSON hợp lệ.", "invalid_request", 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return errorResponse("Dữ liệu hội thoại không hợp lệ.", "invalid_request", 400);
  }

  const message = (body as Record<string, unknown>).message;
  if (typeof message !== "string" || !message.trim()) {
    return errorResponse("Hãy nhập nội dung cần hỏi.", "invalid_request", 400);
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return errorResponse(
      `Nội dung vượt giới hạn ${MAX_MESSAGE_CHARS} ký tự.`,
      "request_too_large",
      413,
    );
  }

  try {
    const prompt = buildWorkspaceChatPrompt([
      {
        role: "system",
        content:
          "Bạn đang làm việc trong DHP Workspace. Trả lời ngắn gọn, chính xác và không bịa dữ liệu nội bộ chưa được cung cấp.",
      },
      { role: "user", content: message.trim() },
    ]);
    const result = await runWorkspaceChatWithModelRuntimeCapability(prompt);

    return Response.json(
      {
        reply: result.outputText,
        provider: result.provider,
        model: result.model,
        tier: "free",
        verifiedFree: true,
      },
      {
        headers: {
          "cache-control": "no-store",
          "x-content-type-options": "nosniff",
        },
      },
    );
  } catch (error) {
    if (error instanceof ModelRuntimeCapabilityError) {
      return runtimeErrorResponse(error);
    }
    return errorResponse("DHP Workspace AI tạm thời không khả dụng.", "workspace_ai_unavailable", 502);
  }
}
