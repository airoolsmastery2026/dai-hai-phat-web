const MAX_IDENTIFIER_LENGTH = 160;
const MAX_CHANNELS = 6;

const PUBLISHING_COMMANDS = [
  "publishing.health",
  "publishing.queue",
  "publishing.job.get",
  "publishing.tokens.status",
  "publishing.analytics",
  "publishing.job.create",
  "publishing.scheduler.pause",
  "publishing.scheduler.resume",
  "publishing.job.retry",
] as const;

const WRITE_COMMANDS = new Set<PublishingBotCommand>([
  "publishing.job.create",
  "publishing.scheduler.pause",
  "publishing.scheduler.resume",
  "publishing.job.retry",
]);

const ALLOWED_CHANNELS = new Set([
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
  "pinterest",
  "zalo",
]);

export type PublishingBotCommand = (typeof PUBLISHING_COMMANDS)[number];

export interface PublishingBotClientConfig {
  baseUrl: string;
  token: string;
}

interface PublishingBotBaseCommand {
  command: PublishingBotCommand;
  requestId: string;
  idempotencyKey?: string;
}

interface PublishingBotJobCommand extends PublishingBotBaseCommand {
  command: "publishing.job.get" | "publishing.job.retry";
  jobId: string;
}

interface PublishingBotCreateJobCommand extends PublishingBotBaseCommand {
  command: "publishing.job.create";
  idempotencyKey: string;
  contentRef: {
    entityType: "article" | "product" | "service";
    entityId: string;
  };
  channels: string[];
}

interface PublishingBotSimpleCommand extends PublishingBotBaseCommand {
  command:
    | "publishing.health"
    | "publishing.queue"
    | "publishing.tokens.status"
    | "publishing.analytics"
    | "publishing.scheduler.pause"
    | "publishing.scheduler.resume";
}

export type PublishingBotRequest =
  | PublishingBotJobCommand
  | PublishingBotCreateJobCommand
  | PublishingBotSimpleCommand;

export interface PublishingBotRequestInit {
  method: "GET" | "POST";
  headers: Record<string, string>;
  cache: "no-store";
  body?: string;
}

export interface PublishingBotBuiltRequest {
  url: string;
  init: PublishingBotRequestInit;
}

export type PublishingBotParsedResponse =
  | {
      ok: true;
      requestId: string;
      data: unknown;
    }
  | {
      ok: false;
      requestId: string;
      error: {
        code: string;
        message: string;
        retryable: boolean;
      };
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function boundedText(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized || normalized.length > MAX_IDENTIFIER_LENGTH) {
    throw new Error(`${field} is invalid.`);
  }
  return normalized;
}

function normalizeConfig(config: PublishingBotClientConfig): PublishingBotClientConfig {
  const token = config.token.trim();
  if (!token) throw new Error("Publishing Bot token is required.");

  let parsed: URL;
  try {
    parsed = new URL(config.baseUrl);
  } catch {
    throw new Error("Publishing Bot base URL is invalid.");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("Publishing Bot base URL must use HTTPS.");
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error("Publishing Bot base URL is invalid.");
  }

  return {
    baseUrl: parsed.toString().replace(/\/$/, ""),
    token,
  };
}

function requestPath(request: PublishingBotRequest): string {
  switch (request.command) {
    case "publishing.health":
      return "/api/v1/publishing/health";
    case "publishing.queue":
      return "/api/v1/publishing/queue";
    case "publishing.tokens.status":
      return "/api/v1/publishing/tokens/status";
    case "publishing.analytics":
      return "/api/v1/publishing/analytics";
    case "publishing.job.get":
      return `/api/v1/publishing/jobs/${encodeURIComponent(boundedText(request.jobId, "jobId"))}`;
    case "publishing.job.retry":
      return `/api/v1/publishing/jobs/${encodeURIComponent(boundedText(request.jobId, "jobId"))}/retry`;
    case "publishing.job.create":
      return "/api/v1/publishing/jobs";
    case "publishing.scheduler.pause":
      return "/api/v1/publishing/scheduler/pause";
    case "publishing.scheduler.resume":
      return "/api/v1/publishing/scheduler/resume";
  }
}

function requestBody(request: PublishingBotRequest): string | undefined {
  if (request.command !== "publishing.job.create") return undefined;

  const entityId = boundedText(request.contentRef.entityId, "contentRef.entityId");
  if (!request.channels.length || request.channels.length > MAX_CHANNELS) {
    throw new Error("Publishing channel selection is invalid.");
  }

  const channels = request.channels.map((channel) => {
    const normalized = channel.trim().toLowerCase();
    if (!ALLOWED_CHANNELS.has(normalized)) {
      throw new Error("Publishing channel is not approved.");
    }
    return normalized;
  });

  if (new Set(channels).size !== channels.length) {
    throw new Error("Publishing channel selection contains duplicates.");
  }

  return JSON.stringify({
    contentRef: {
      entityType: request.contentRef.entityType,
      entityId,
    },
    channels,
  });
}

export function isPublishingBotCommand(value: unknown): value is PublishingBotCommand {
  return typeof value === "string" &&
    (PUBLISHING_COMMANDS as readonly string[]).includes(value);
}

export function buildPublishingBotRequest(
  rawConfig: PublishingBotClientConfig,
  request: PublishingBotRequest,
): PublishingBotBuiltRequest {
  const config = normalizeConfig(rawConfig);
  const requestId = boundedText(request.requestId, "requestId");
  const isWrite = WRITE_COMMANDS.has(request.command);
  const headers: Record<string, string> = {
    authorization: `Bearer ${config.token}`,
    "x-dhp-request-id": requestId,
    "x-dhp-source-service": "website",
  };

  if (isWrite) {
    if (!request.idempotencyKey) {
      throw new Error("Idempotency-Key is required for Publishing Bot writes.");
    }
    headers["idempotency-key"] = boundedText(
      request.idempotencyKey,
      "Idempotency-Key",
    );
  }

  const body = requestBody(request);
  if (body !== undefined) headers["content-type"] = "application/json";

  return {
    url: `${config.baseUrl}${requestPath(request)}`,
    init: {
      method: isWrite ? "POST" : "GET",
      headers,
      cache: "no-store",
      ...(body === undefined ? {} : { body }),
    },
  };
}

export function parsePublishingBotResponse(
  value: unknown,
): PublishingBotParsedResponse {
  if (
    !isRecord(value) ||
    value.schemaVersion !== "1.0" ||
    typeof value.requestId !== "string" ||
    !value.requestId.trim()
  ) {
    throw new Error("Invalid Publishing Bot response envelope.");
  }

  const requestId = boundedText(value.requestId, "requestId");
  const hasData = Object.prototype.hasOwnProperty.call(value, "data");
  const hasError = Object.prototype.hasOwnProperty.call(value, "error");
  if (hasData === hasError) {
    throw new Error("Invalid Publishing Bot response envelope.");
  }

  if (hasData) {
    return { ok: true, requestId, data: value.data };
  }

  if (!isRecord(value.error)) {
    throw new Error("Invalid Publishing Bot response envelope.");
  }
  if (
    typeof value.error.code !== "string" ||
    typeof value.error.message !== "string" ||
    typeof value.error.retryable !== "boolean"
  ) {
    throw new Error("Invalid Publishing Bot response envelope.");
  }

  return {
    ok: false,
    requestId,
    error: {
      code: boundedText(value.error.code, "error.code"),
      message: boundedText(value.error.message, "error.message"),
      retryable: value.error.retryable,
    },
  };
}
