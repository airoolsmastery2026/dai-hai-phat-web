export type OpenAiChatRole = "system" | "user" | "assistant";

export interface OpenAiChatMessage {
  role: OpenAiChatRole;
  content: string;
}

export interface OpenAiChatRequest {
  model: "dhp-free";
  messages: OpenAiChatMessage[];
  stream: false;
}

export class OpenAiCompatibilityError extends Error {
  constructor(
    message: string,
    readonly code: "invalid_request" | "unsupported_model" | "unsupported_stream",
  ) {
    super(message);
    this.name = "OpenAiCompatibilityError";
  }
}

const MAX_MESSAGES = 64;
const MAX_PROMPT_CHARS = 60_000;
const ALLOWED_ROLES = new Set<OpenAiChatRole>(["system", "user", "assistant"]);

export function parseOpenAiChatRequest(value: unknown): OpenAiChatRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new OpenAiCompatibilityError("Request body must be a JSON object.", "invalid_request");
  }

  const body = value as Record<string, unknown>;
  if (body.stream === true) {
    throw new OpenAiCompatibilityError(
      "Streaming is not supported by DHP Free LLM v1.",
      "unsupported_stream",
    );
  }

  const model = body.model ?? "dhp-free";
  if (model !== "dhp-free") {
    throw new OpenAiCompatibilityError(
      "Use model 'dhp-free' so the backend can select a currently verified zero-cost cloud model.",
      "unsupported_model",
    );
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > MAX_MESSAGES) {
    throw new OpenAiCompatibilityError(
      `messages must contain between 1 and ${MAX_MESSAGES} items.`,
      "invalid_request",
    );
  }

  let totalChars = 0;
  const messages = body.messages.map((message, index): OpenAiChatMessage => {
    if (!message || typeof message !== "object" || Array.isArray(message)) {
      throw new OpenAiCompatibilityError(`messages[${index}] must be an object.`, "invalid_request");
    }
    const item = message as Record<string, unknown>;
    if (typeof item.role !== "string" || !ALLOWED_ROLES.has(item.role as OpenAiChatRole)) {
      throw new OpenAiCompatibilityError(
        `messages[${index}].role must be system, user, or assistant.`,
        "invalid_request",
      );
    }
    if (typeof item.content !== "string" || !item.content.trim()) {
      throw new OpenAiCompatibilityError(
        `messages[${index}].content must be non-empty text.`,
        "invalid_request",
      );
    }
    totalChars += item.content.length;
    return {
      role: item.role as OpenAiChatRole,
      content: item.content.trim(),
    };
  });

  if (totalChars > MAX_PROMPT_CHARS) {
    throw new OpenAiCompatibilityError(
      `Conversation exceeds the ${MAX_PROMPT_CHARS}-character v1 limit.`,
      "invalid_request",
    );
  }

  return { model: "dhp-free", messages, stream: false };
}

export function buildWorkspaceChatPrompt(messages: readonly OpenAiChatMessage[]): string {
  const conversation = messages
    .map((message) => `[${message.role.toUpperCase()}]\n${message.content}`)
    .join("\n\n");

  return [
    "You are the DHP Workspace assistant inside Đại Hải Phát AI OS.",
    "Follow the conversation roles and answer the latest user request.",
    "Do not claim access to DHP records unless the supplied context actually contains them.",
    "Return assistant text only; do not wrap the answer in JSON.",
    "CONVERSATION:",
    conversation,
    "[ASSISTANT]",
  ].join("\n");
}

export function openAiErrorResponse(
  message: string,
  code: string,
  status: number,
): Response {
  return Response.json(
    {
      error: {
        message,
        type: "dhp_llm_error",
        param: null,
        code,
      },
    },
    { status },
  );
}
