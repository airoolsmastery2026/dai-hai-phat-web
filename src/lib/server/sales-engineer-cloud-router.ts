import type {
  SalesEngineerAgentRequest,
  SalesEngineerAgentResponse,
  SalesEngineerToolResult,
} from "@/lib/ai/sales-engineer-agent";
import {
  ModelRuntimeCapabilityError,
  runSalesEngineerWithModelRuntimeCapability,
} from "@/lib/server/model-runtime-capability";
import {
  readSalesEngineerMemory,
  writeSalesEngineerMemory,
} from "@/lib/server/sales-engineer-memory";

const CAPABILITY_COOLDOWN_MS = 60_000;
let capabilityCooldownUntil = 0;

export interface RoutedSalesEngineerAgent {
  agent: SalesEngineerAgentResponse;
  cache: "HIT" | "MISS";
  fingerprint: string;
}

function capabilityEligible(): boolean {
  return capabilityCooldownUntil <= Date.now();
}

function shouldCoolDown(error: ModelRuntimeCapabilityError): boolean {
  return (
    error.code === "rate_limit" ||
    error.code === "timeout" ||
    error.code === "upstream"
  );
}

export async function runSalesEngineerWithCloudRouter(
  request: SalesEngineerAgentRequest,
  tools: SalesEngineerToolResult[],
): Promise<RoutedSalesEngineerAgent> {
  const memory = await readSalesEngineerMemory(request, tools);
  if (memory.agent) {
    return { agent: memory.agent, cache: "HIT", fingerprint: memory.fingerprint };
  }

  if (!capabilityEligible()) {
    throw new ModelRuntimeCapabilityError(
      "Các model cloud miễn phí đang trong thời gian cooldown.",
      "rate_limit",
    );
  }

  try {
    const agent = await runSalesEngineerWithModelRuntimeCapability(request, tools);
    await writeSalesEngineerMemory(memory.fingerprint, agent);
    return { agent, cache: "MISS", fingerprint: memory.fingerprint };
  } catch (error) {
    if (error instanceof ModelRuntimeCapabilityError && shouldCoolDown(error)) {
      capabilityCooldownUntil = Date.now() + CAPABILITY_COOLDOWN_MS;
    }
    throw error;
  }
}
