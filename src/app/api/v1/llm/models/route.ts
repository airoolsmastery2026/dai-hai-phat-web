import {
  LlmClientAuthenticationError,
  authenticateLlmClient,
} from "@/lib/server/llm-client-auth";
import { openAiErrorResponse } from "@/lib/server/openai-compatible-llm";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
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

  return Response.json(
    {
      object: "list",
      data: [
        {
          id: "dhp-free",
          object: "model",
          created: 0,
          owned_by: "dai-hai-phat",
        },
      ],
    },
    {
      headers: {
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    },
  );
}
