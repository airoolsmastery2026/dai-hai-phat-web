import { requestCapabilityGateway } from "@/lib/dhp-control-plane";

export const DHP_CAPABILITY_IDS = [
  "agent-runtime",
  "workflow",
  "knowledge",
  "model-runtime",
  "media",
  "notifications",
  "analytics",
  "internal-tools",
  "content",
  "platform-services",
  "external-data",
  "oss-discovery",
] as const;

export type DhpCapabilityId = (typeof DHP_CAPABILITY_IDS)[number];

const capabilityIds = new Set<string>(DHP_CAPABILITY_IDS);
const SAFE_PATH_SEGMENT = /^[a-z0-9][a-z0-9-]*$/;

export function isDhpCapabilityId(value: string): value is DhpCapabilityId {
  return capabilityIds.has(value);
}

function encodeOperation(segments: readonly string[]): string {
  return segments
    .map((segment) => {
      if (!SAFE_PATH_SEGMENT.test(segment)) {
        throw new Error(`Unsafe capability path segment: ${segment}`);
      }
      return encodeURIComponent(segment);
    })
    .join("/");
}

export function buildCapabilityPath(
  capability: DhpCapabilityId,
  operation: readonly string[] = [],
): string {
  if (!isDhpCapabilityId(capability)) {
    throw new Error(`Unknown DHP capability: ${capability}`);
  }

  const suffix = encodeOperation(operation);
  const base = `/v1/capabilities/${encodeURIComponent(capability)}`;
  return suffix ? `${base}/${suffix}` : base;
}

export function requestDhpCapability(
  capability: DhpCapabilityId,
  operation: readonly string[] = [],
  init: RequestInit = {},
): Promise<Response> {
  return requestCapabilityGateway(buildCapabilityPath(capability, operation), init);
}
