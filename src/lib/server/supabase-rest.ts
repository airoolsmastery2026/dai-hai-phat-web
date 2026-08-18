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

type SupabaseRpcName =
  | "dhp_publish_admin_list_accounts"
  | "dhp_publish_store_and_request_verify"
  | "dhp_publish_request_verify"
  | "dhp_publish_remove_account"
  | "dhp_telegram_admin_status"
  | "dhp_telegram_store_config";

type SupabaseTable =
  | "customer_profiles"
  | "concept_quota_ledger"
  | "project_inquiries"
  | "ai_analysis_memory"
  | "ai_memory_objects";

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

export function getSupabaseServerConfig(env: NodeJS.ProcessEnv = process.env): SupabaseServerConfig {
  const url = env.SUPABASE_URL?.trim();
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    throw new SupabaseServerConfigurationError("Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trên server.");
  }
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== "https:") {
    throw new SupabaseServerConfigurationError("SUPABASE_URL phải sử dụng HTTPS.");
  }
  return { url: parsedUrl.toString().replace(/\/$/, ""), serviceRoleKey };
}

function serverHeaders(config: SupabaseServerConfig, prefer?: string): HeadersInit {
  return {
    apikey: config.serviceRoleKey,
    authorization: `Bearer ${config.serviceRoleKey}`,
    "content-type": "application/json",
    ...(prefer ? { prefer } : {}),
  };
}

export async function supabaseRestRequest<T>(
  table: SupabaseTable,
  options: SupabaseRestRequestOptions = {},
  config: SupabaseServerConfig = getSupabaseServerConfig(),
): Promise<T> {
  const endpoint = new URL(`/rest/v1/${table}`, config.url);
  if (options.query) endpoint.search = options.query.toString();
  const response = await fetch(endpoint, {
    method: options.method ?? "GET",
    headers: serverHeaders(config, options.prefer),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
    signal: options.signal,
  });
  return readSupabaseResponse<T>(response);
}

export async function supabaseRpcRequest<T>(
  rpc: SupabaseRpcName,
  body: Record<string, unknown>,
  config: SupabaseServerConfig = getSupabaseServerConfig(),
): Promise<T> {
  const endpoint = new URL(`/rest/v1/rpc/${rpc}`, config.url);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: serverHeaders(config),
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  return readSupabaseResponse<T>(response);
}

async function readSupabaseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const payload = text ? safeParseJson(text) : null;
  if (!response.ok) throw new SupabaseRestError("Supabase REST request failed.", response.status, payload);
  return payload as T;
}

function safeParseJson(value: string): unknown {
  try { return JSON.parse(value); } catch { return value; }
}
