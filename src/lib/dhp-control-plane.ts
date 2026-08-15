const DEFAULT_TIMEOUT_MS = 30_000;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function timeoutMs(): number {
  const raw = process.env.DHP_CONTROL_PLANE_TIMEOUT_MS?.trim();
  if (!raw) return DEFAULT_TIMEOUT_MS;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error('DHP_CONTROL_PLANE_TIMEOUT_MS must be a positive integer');
  }
  return parsed;
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/$/, '');
}

function capabilityGatewayBaseUrl(): string {
  const explicit = process.env.DHP_CAPABILITY_GATEWAY_URL?.trim();
  if (explicit) return normalizeBaseUrl(explicit);

  const controlPlaneUrl = new URL(requiredEnv('DHP_CONTROL_PLANE_URL'));
  if (!controlPlaneUrl.pathname.match(/\/dhp-control-plane-cloud\/?$/)) {
    throw new Error('DHP_CAPABILITY_GATEWAY_URL is not configured');
  }

  controlPlaneUrl.pathname = controlPlaneUrl.pathname.replace(
    /\/dhp-control-plane-cloud\/?$/,
    '/dhp-capability-gateway',
  );
  controlPlaneUrl.search = '';
  controlPlaneUrl.hash = '';
  return normalizeBaseUrl(controlPlaneUrl.toString());
}

async function requestDhpService(
  baseUrl: string,
  path: string,
  init: RequestInit,
): Promise<Response> {
  const keyId = requiredEnv('DHP_CONTROL_PLANE_KEY_ID');
  const secret = requiredEnv('DHP_CONTROL_PLANE_SECRET');
  const safePath = path.startsWith('/') ? path : `/${path}`;

  const headers = new Headers(init.headers);
  headers.set('authorization', `DHP-Key ${keyId}:${secret}`);
  if (init.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  return fetch(`${normalizeBaseUrl(baseUrl)}${safePath}`, {
    ...init,
    headers,
    cache: 'no-store',
    signal: AbortSignal.timeout(timeoutMs()),
  });
}

export function requestControlPlane(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  return requestDhpService(requiredEnv('DHP_CONTROL_PLANE_URL'), path, init);
}

export function requestCapabilityGateway(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  return requestDhpService(capabilityGatewayBaseUrl(), path, init);
}
