import {
  LlmClientAuthenticationError,
  authenticateLlmClient,
} from "@/lib/server/llm-client-auth";
import {
  OpenAiCompatibilityError,
  buildWorkspaceChatPrompt,
  openAiErrorResponse,
  parseOpenAiChatRequest,
} from "@/lib/server/openai-compatible-llm";
import {
  ModelRuntimeCapabilityError,
  runWorkspaceChatWithModelRuntimeCapability,
} from "@/lib/server/model-runtime-capability";

export const dynamic = "force-dynamic";

function runtimeErrorResponse(error: ModelRuntimeCapabilityError): Response {
  switch (error.code) {
    case "configuration":
      return openAiErrorResponse(error.message, "zero_cost_provider_not_configured", 503);
    case "rate_limit":
      return openAiErrorResponse(error.message, "zero_cost_quota_limited", 429);
    case "timeout":
      return openAiErrorResponse(error.message, "model_runtime_timeout", 504);
    case "invalid_output":
      return openAiErrorResponse(error.message, "invalid_model_output", 502);
    default:
      return openAiErrorResponse(error.message, "model_runtime_unavailable", 502);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    authenticateLlmClient(request.headers);
  } catch (error) {
    if (error instanceof LlmClientAuthenticationError) {
      return error.code === "not_configured"
        ? openAiErrorResponse(
            "DHP Free LLM client authentication is not configured.",
            "llm_auth_not_configured",
            503,
          )
        : openAiErrorResponse("Invalid DHP Free LLM API key.", "invalid_api_key", 401);
    }
    return openAiErrorResponse("Unable to authenticate LLM client.", "authentication_error", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return openAiErrorResponse("Request body must be valid JSON.", "invalid_request", 400);
  }

  let parsed;
  try {
    parsed = parseOpenAiChatRequest(body);
  } catch (error) {
    if (error instanceof OpenAiCompatibilityError) {
      return openAiErrorResponse(error.message, error.code, 400);
    }
    return openAiErrorResponse("Invalid chat completion request.", "invalid_request", 400);
  }

  try {
    const result = await runWorkspaceChatWithModelRuntimeCapability(
      buildWorkspaceChatPrompt(parsed.messages),
    );
    const created = Math.floor(Date.now() / 1000);
    const id = `chatcmpl-dhp-${crypto.randomUUID().replaceAll("-", "")}`;

    return Response.json(
      {
        id,
        object: "chat.completion",
        created,
        model: "dhp-free",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: result.outputText,
            },
            finish_reason: "stop",
          },
        ],
        dhp: {
          provider: result.provider,
          routed_model: result.model,
          tier: "free",
          verified_free: true,
        },
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
    return openAiErrorResponse("DHP Free LLM is unavailable.", "model_runtime_unavailable", 502);
  }
}
