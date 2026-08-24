export const DHP_RUNTIME_POLICY_VERSION = "1.0" as const;

export const DHP_RUNTIME_CAPABILITIES = [
  "acp",
  "mcp",
  "filesystem.read",
  "workspace.execute",
  "research",
] as const;

export type DhpRuntimeCapability = (typeof DHP_RUNTIME_CAPABILITIES)[number];

export interface DhpRuntimeHandshakeInput {
  nodeId: string;
  runtime: "goose-desktop" | "goose-cli";
  runtimeVersion: string;
  transport: "acp-stdio" | "acp-loopback";
  costMode: "absolute-zero";
  capabilities: string[];
  localProviders?: string[];
}

export interface DhpRuntimeHandshakeResult {
  accepted: true;
  nodeId: string;
  runtime: DhpRuntimeHandshakeInput["runtime"];
  runtimeVersion: string;
  transport: DhpRuntimeHandshakeInput["transport"];
  costMode: "absolute-zero";
  capabilities: DhpRuntimeCapability[];
  localProviders: string[];
  policyVersion: typeof DHP_RUNTIME_POLICY_VERSION;
}

export class DhpRuntimeHandshakeError extends Error {
  constructor(
    readonly code:
      | "INVALID_PAYLOAD"
      | "ZERO_DOLLAR_REQUIRED"
      | "NO_SUPPORTED_CAPABILITY",
  ) {
    super(code);
  }
}

const NODE_ID_PATTERN = /^[A-Za-z0-9._-]{1,128}$/;
const VERSION_PATTERN = /^[A-Za-z0-9._+-]{1,64}$/;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readStringArray(value: unknown, limit: number): string[] | null {
  if (!Array.isArray(value) || value.length > limit) return null;

  const result: string[] = [];
  for (const item of value) {
    const normalized = readString(item);
    if (!normalized || normalized.length > 128) return null;
    if (!result.includes(normalized)) result.push(normalized);
  }
  return result;
}

export function parseDhpRuntimeHandshake(
  value: unknown,
): DhpRuntimeHandshakeResult {
  const input = asRecord(value);
  if (!input) throw new DhpRuntimeHandshakeError("INVALID_PAYLOAD");

  const nodeId = readString(input.nodeId);
  const runtime = readString(input.runtime);
  const runtimeVersion = readString(input.runtimeVersion);
  const transport = readString(input.transport);
  const costMode = readString(input.costMode);
  const capabilities = readStringArray(input.capabilities, 32);
  const localProviders =
    input.localProviders === undefined
      ? []
      : readStringArray(input.localProviders, 16);

  if (
    !nodeId ||
    !NODE_ID_PATTERN.test(nodeId) ||
    !runtimeVersion ||
    !VERSION_PATTERN.test(runtimeVersion) ||
    !capabilities ||
    !localProviders ||
    (runtime !== "goose-desktop" && runtime !== "goose-cli") ||
    (transport !== "acp-stdio" && transport !== "acp-loopback")
  ) {
    throw new DhpRuntimeHandshakeError("INVALID_PAYLOAD");
  }

  if (costMode !== "absolute-zero") {
    throw new DhpRuntimeHandshakeError("ZERO_DOLLAR_REQUIRED");
  }

  const allowedCapabilities = capabilities.filter(
    (capability): capability is DhpRuntimeCapability =>
      (DHP_RUNTIME_CAPABILITIES as readonly string[]).includes(capability),
  );

  if (allowedCapabilities.length === 0) {
    throw new DhpRuntimeHandshakeError("NO_SUPPORTED_CAPABILITY");
  }

  return {
    accepted: true,
    nodeId,
    runtime,
    runtimeVersion,
    transport,
    costMode: "absolute-zero",
    capabilities: allowedCapabilities,
    localProviders,
    policyVersion: DHP_RUNTIME_POLICY_VERSION,
  };
}
