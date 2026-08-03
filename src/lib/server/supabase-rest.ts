import "server-only";

interface SupabaseServerConfig {
  url: string;
  serviceRoleKey: string;
}

interface SupabaseRestRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: URLSearchParams;
  body?: unknown;
  prefer?: string;
  signal?: AbortSignal;
}

export class SupabaseServerConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseServerConfigurationError";
  }
}

export class SupabaseRestError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "SupabaseRestError";
    this.status = status;
    this.details = details;
  }
}

export function getSupabaseServerConfig(
  env: NodeJS.ProcessEnv = process.env,
): SupabaseServerConfig {
  const url = env.SUPABASE_URL?.trim();
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    throw new SupabaseServerConfigurationError(
      "Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trên server.",
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new SupabaseServerConfigurationError("SUPABASE_URL không hợp lệ.");
  }

  if (parsedUrl.protocol !== "https:") {
    throw new SupabaseServerConfigurationError(
      "SUPABASE_URL phải sử dụng HTTPS.",
    );
  }

  return {
    url: parsedUrl.toString().replace(/\/$/, ""),
    serviceRoleKey,
  };
}

export async function supabaseRestRequest<T>(
  table: "customer_profiles" | "concept_quota_ledger",
  options: SupabaseRestRequestOptions = {},
  config: SupabaseServerConfig = getSupabaseServerConfig(),
): Promise<T> {
  const endpoint = new URL(`/rest/v1/${table}`, config.url);
  if (options.query) endpoint.search = options.query.toString();

  const response = await fetch(endpoint, {
    method: options.method ?? "GET",
    headers: {
      apikey: config.serviceRoleKey,
      authorization: `Bearer ${config.serviceRoleKey}`,
      "content-type": "application/json",
      ...(options.prefer ? { prefer: options.prefer } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
    signal: options.signal,
  });

  const text = await response.text();
  const payload = text ? safeParseJson(text) : null;

  if (!response.ok) {
    throw new SupabaseRestError(
      "Supabase REST request failed.",
      response.status,
      payload,
    );
  }

  return payload as T;
}

function safeParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
