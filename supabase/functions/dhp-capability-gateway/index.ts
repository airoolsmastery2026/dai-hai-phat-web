import { createClient } from 'npm:@supabase/supabase-js@2';

type Principal = {
  keyId: string;
  projectId: string;
  actorId: string;
  roles: string[];
};

type CapabilityDefinition = {
  id: string;
  purpose: string;
  candidates: string[];
  envPrefix?: string;
  nativePath?: string;
  mode: 'runtime' | 'discovery';
};

type OpenRouterModel = {
  id?: unknown;
  name?: unknown;
  context_length?: unknown;
  created?: unknown;
  pricing?: {
    prompt?: unknown;
    completion?: unknown;
    request?: unknown;
  };
  architecture?: {
    output_modalities?: unknown;
  };
};

type OpenRouterModelsResponse = { data?: OpenRouterModel[] };
type OpenRouterChatResponse = {
  model?: unknown;
  choices?: Array<{ message?: { content?: unknown } }>;
};

const CAPABILITIES: CapabilityDefinition[] = [
  {
    id: 'agent-runtime',
    purpose: 'Agent workspace and skill execution',
    candidates: ['openwork'],
    envPrefix: 'DHP_AGENT_RUNTIME',
    nativePath: '/v1/skills',
    mode: 'runtime',
  },
  {
    id: 'workflow',
    purpose: 'Agent workflow and RAG orchestration',
    candidates: ['dify'],
    envPrefix: 'DHP_WORKFLOW',
    mode: 'runtime',
  },
  {
    id: 'knowledge',
    purpose: 'Knowledge retrieval and enrichment',
    candidates: ['dify'],
    envPrefix: 'DHP_KNOWLEDGE',
    mode: 'runtime',
  },
  {
    id: 'model-runtime',
    purpose: 'Cloud-only zero-cost model routing and quota failover',
    candidates: ['openrouter-free'],
    mode: 'runtime',
  },
  {
    id: 'media',
    purpose: 'Media workflow and media-library services',
    candidates: ['immich'],
    envPrefix: 'DHP_MEDIA_LIBRARY',
    nativePath: '/v1/media',
    mode: 'runtime',
  },
  {
    id: 'notifications',
    purpose: 'Email, SMS, push and in-app notification orchestration',
    candidates: ['novu'],
    envPrefix: 'DHP_NOTIFICATIONS',
    mode: 'runtime',
  },
  {
    id: 'analytics',
    purpose: 'Privacy-friendly product and conversion analytics',
    candidates: ['plausible'],
    envPrefix: 'DHP_ANALYTICS',
    mode: 'runtime',
  },
  {
    id: 'internal-tools',
    purpose: 'Internal operations tools and dashboards',
    candidates: ['tooljet'],
    envPrefix: 'DHP_INTERNAL_TOOLS',
    mode: 'runtime',
  },
  {
    id: 'content',
    purpose: 'Optional headless content service',
    candidates: ['strapi'],
    envPrefix: 'DHP_CONTENT',
    mode: 'runtime',
  },
  {
    id: 'platform-services',
    purpose: 'Optional backend platform services without replacing website ownership',
    candidates: ['appwrite'],
    envPrefix: 'DHP_PLATFORM_SERVICES',
    mode: 'runtime',
  },
  {
    id: 'external-data',
    purpose: 'Curated external data APIs selected for concrete features',
    candidates: ['public-apis'],
    envPrefix: 'DHP_EXTERNAL_DATA',
    mode: 'runtime',
  },
  {
    id: 'oss-discovery',
    purpose: 'Discovery catalog for self-hosted alternatives; never called by the public web directly',
    candidates: ['awesome-selfhosted'],
    mode: 'discovery',
  },
];

const CAPABILITY_BY_ID = new Map(CAPABILITIES.map((item) => [item.id, item]));
const DEFAULT_TIMEOUT_MS = 30_000;
const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models?sort=newest';
const MODEL_PROMPT_LIMIT = 64_000;

function serviceKey(): string {
  const modern = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (modern) {
    try {
      const keys = JSON.parse(modern) as Record<string, string>;
      if (keys.default) return keys.default;
    } catch {
      // Fall through to the legacy key.
    }
  }
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!legacy) throw new Error('Supabase service key is unavailable');
  return legacy;
}

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey(), {
  auth: { persistSession: false, autoRefreshToken: false },
});

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

function relativePath(url: URL): string {
  const marker = '/dhp-capability-gateway';
  const index = url.pathname.indexOf(marker);
  if (index < 0) return url.pathname;
  return url.pathname.slice(index + marker.length) || '/';
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(digest).map((item) => item.toString(16).padStart(2, '0')).join('');
}

function secureEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

async function authenticate(request: Request): Promise<Principal> {
  const header = request.headers.get('authorization') ?? '';
  const match = header.match(/^DHP-Key\s+([^:]+):(.+)$/);
  if (!match) throw new Error('Missing or invalid authorization header');

  const [, keyId, secret] = match;
  const { data, error } = await supabase
    .from('dhp_agent_api_keys')
    .select('key_id,key_hash,project_id,actor_id,roles,enabled')
    .eq('key_id', keyId)
    .maybeSingle();

  if (error || !data || !data.enabled) throw new Error('Invalid API key');
  const actual = await sha256(secret);
  if (!secureEqual(String(data.key_hash), actual)) throw new Error('Invalid API key');

  await supabase
    .from('dhp_agent_api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('key_id', keyId);

  return {
    keyId,
    projectId: String(data.project_id),
    actorId: String(data.actor_id),
    roles: Array.isArray(data.roles) ? data.roles.map((role) => String(role).toLowerCase()) : [],
  };
}

function requireAdmin(principal: Principal): void {
  if (!principal.roles.includes('admin')) throw new Error('Forbidden: requires admin role');
}

function adapterUrl(definition: CapabilityDefinition): string | null {
  if (!definition.envPrefix) return null;
  return Deno.env.get(`${definition.envPrefix}_URL`)?.trim() || null;
}

function openRouterConfigured(): boolean {
  return Boolean(Deno.env.get('OPENROUTER_API_KEY')?.trim());
}

function capabilitySnapshot(definition: CapabilityDefinition) {
  const configuredUrl = adapterUrl(definition);
  const internalModelRuntime = definition.id === 'model-runtime' && openRouterConfigured();
  const state = configuredUrl || internalModelRuntime
    ? 'configured'
    : definition.nativePath
      ? 'native'
      : definition.mode === 'discovery'
        ? 'catalog'
        : 'reserved';

  return {
    id: definition.id,
    purpose: definition.purpose,
    candidates: definition.candidates,
    mode: definition.mode,
    state,
    nativePath: definition.nativePath ?? null,
    adapter: {
      configured: Boolean(configuredUrl || internalModelRuntime),
      contract: definition.id === 'model-runtime'
        ? 'dhp-model-runtime-free-v1'
        : definition.mode === 'runtime'
          ? 'dhp-http-json-v1'
          : null,
    },
  };
}

function providerTimeout(): number {
  const value = Number(Deno.env.get('DHP_CAPABILITY_TIMEOUT_MS') ?? String(DEFAULT_TIMEOUT_MS));
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_TIMEOUT_MS;
}

async function parseBody(request: Request): Promise<Record<string, unknown>> {
  const length = Number(request.headers.get('content-length') ?? '0');
  if (length > 1_000_000) throw new Error('Request body exceeds 1 MB limit');
  const value: unknown = await request.json();
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid JSON object');
  }
  return value as Record<string, unknown>;
}

function isZeroPrice(value: unknown): boolean {
  return value === 0 || value === '0';
}

function isVerifiedFreeModel(model: OpenRouterModel): boolean {
  if (typeof model.id !== 'string' || !model.pricing) return false;
  if (!isZeroPrice(model.pricing.prompt) || !isZeroPrice(model.pricing.completion)) return false;
  if (model.pricing.request !== undefined && !isZeroPrice(model.pricing.request)) return false;
  const modalities = model.architecture?.output_modalities;
  return !Array.isArray(modalities) || modalities.includes('text');
}

async function discoverOpenRouterFreeModels(): Promise<Array<Record<string, unknown>>> {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY')?.trim();
  if (!apiKey) return [];
  const response = await fetch(OPENROUTER_MODELS_URL, {
    headers: { authorization: `Bearer ${apiKey}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(Math.min(providerTimeout(), 10_000)),
  });
  if (!response.ok) return [];
  const payload = await response.json() as OpenRouterModelsResponse;
  return (Array.isArray(payload.data) ? payload.data : [])
    .filter(isVerifiedFreeModel)
    .slice(0, 100)
    .map((model) => ({
      id: model.id,
      name: typeof model.name === 'string' ? model.name : model.id,
      contextLength: typeof model.context_length === 'number' ? model.context_length : null,
      created: typeof model.created === 'number' ? model.created : null,
      tier: 'free',
      verifiedFree: true,
      discoverySource: 'openrouter-models-api',
    }));
}

async function executeModelRuntime(input: Record<string, unknown>): Promise<Response> {
  if (
    input.task !== 'project-analysis' ||
    input.schemaVersion !== '1.0' ||
    input.freeOnly !== true ||
    input.allowPaid !== false ||
    typeof input.prompt !== 'string' ||
    !input.prompt.trim() ||
    input.prompt.length > MODEL_PROMPT_LIMIT
  ) {
    return json({ error: 'Invalid zero-cost model-runtime request' }, 400);
  }

  const apiKey = Deno.env.get('OPENROUTER_API_KEY')?.trim();
  if (!apiKey) {
    return json({
      error: 'No zero-cost cloud model provider is configured',
      capability: 'model-runtime',
    }, 409);
  }

  const response = await fetch(OPENROUTER_CHAT_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(providerTimeout()),
    body: JSON.stringify({
      model: 'openrouter/free',
      messages: [{ role: 'user', content: input.prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  const text = await response.text();
  let payload: OpenRouterChatResponse | null = null;
  try {
    payload = text ? JSON.parse(text) as OpenRouterChatResponse : null;
  } catch {
    return json({ error: 'Zero-cost provider returned invalid JSON' }, 502);
  }

  if (!response.ok) {
    return json({
      error: response.status === 429
        ? 'Zero-cost provider quota is currently limited'
        : 'Zero-cost provider failed',
      capability: 'model-runtime',
      upstreamStatus: response.status,
    }, response.status === 429 ? 429 : 502);
  }

  const outputText = payload?.choices?.[0]?.message?.content;
  if (typeof outputText !== 'string' || !outputText.trim()) {
    return json({ error: 'Zero-cost provider returned no text' }, 502);
  }

  return json({
    schemaVersion: '1.0',
    capability: 'model-runtime',
    data: {
      outputText,
      provider: 'openrouter',
      model: typeof payload?.model === 'string' ? payload.model : 'openrouter/free',
      tier: 'free',
      verifiedFree: true,
      discoverySource: 'openrouter-free-router',
    },
  });
}

async function executeCapability(
  definition: CapabilityDefinition,
  principal: Principal,
  input: Record<string, unknown>,
): Promise<Response> {
  if (definition.mode !== 'runtime') {
    return json({ error: 'Discovery capabilities are not invokable' }, 409);
  }

  const endpoint = adapterUrl(definition);
  if (!endpoint) {
    return json({
      error: 'Capability adapter is not configured',
      capability: definition.id,
      nativePath: definition.nativePath ?? null,
    }, 409);
  }

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'x-dhp-capability': definition.id,
    'x-dhp-project': principal.projectId,
    'x-dhp-actor': principal.actorId,
  };
  const token = definition.envPrefix
    ? Deno.env.get(`${definition.envPrefix}_TOKEN`)?.trim()
    : undefined;
  if (token) headers.authorization = `Bearer ${token}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    cache: 'no-store',
    signal: AbortSignal.timeout(providerTimeout()),
    body: JSON.stringify({
      schemaVersion: '1.0',
      capability: definition.id,
      projectId: principal.projectId,
      actorId: principal.actorId,
      input,
    }),
  });

  const text = await response.text();
  let payload: unknown = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    return json({ error: 'Capability adapter returned invalid JSON' }, 502);
  }

  if (!response.ok) {
    return json({
      error: 'Capability adapter failed',
      capability: definition.id,
      upstreamStatus: response.status,
    }, 502);
  }

  return json({
    schemaVersion: '1.0',
    capability: definition.id,
    data: payload,
  });
}

Deno.serve(async (request) => {
  const url = new URL(request.url);
  const path = relativePath(url);

  try {
    if (request.method === 'GET' && path === '/health') {
      return json({
        status: 'ok',
        service: 'dhp-capability-gateway',
        capabilityCount: CAPABILITIES.length,
        providerCoupling: 'backend-only',
        modelRuntimePolicy: 'free-cloud-only',
      });
    }

    const principal = await authenticate(request);
    requireAdmin(principal);

    if (request.method === 'GET' && path === '/v1/capabilities') {
      return json({
        schemaVersion: '1.0',
        data: CAPABILITIES.map(capabilitySnapshot),
      });
    }

    if (request.method === 'GET' && path === '/v1/capabilities/model-runtime/catalog') {
      return json({
        schemaVersion: '1.0',
        capability: 'model-runtime',
        data: {
          provider: 'openrouter',
          freeModels: await discoverOpenRouterFreeModels(),
          verifiedAt: new Date().toISOString(),
        },
      });
    }

    const match = path.match(/^\/v1\/capabilities\/([a-z0-9-]+)$/);
    if (request.method === 'GET' && match) {
      const definition = CAPABILITY_BY_ID.get(match[1]);
      if (!definition) return json({ error: 'Unknown capability' }, 404);
      return json({ schemaVersion: '1.0', data: capabilitySnapshot(definition) });
    }

    const executeMatch = path.match(/^\/v1\/capabilities\/([a-z0-9-]+)\/execute$/);
    if (request.method === 'POST' && executeMatch) {
      const definition = CAPABILITY_BY_ID.get(executeMatch[1]);
      if (!definition) return json({ error: 'Unknown capability' }, 404);
      const input = await parseBody(request);
      if (definition.id === 'model-runtime') return executeModelRuntime(input);
      return executeCapability(definition, principal, input);
    }

    return json({ error: 'Not found' }, 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('authorization') || message === 'Invalid API key') {
      return json({ error: message }, 401);
    }
    if (message.startsWith('Forbidden:')) return json({ error: message }, 403);
    if (message.includes('required') || message.includes('Invalid JSON') || message.includes('1 MB')) {
      return json({ error: message }, 400);
    }
    if (message.toLowerCase().includes('timeout')) {
      return json({ error: 'Capability adapter timed out' }, 504);
    }
    return json({ error: 'Capability gateway unavailable' }, 500);
  }
});
