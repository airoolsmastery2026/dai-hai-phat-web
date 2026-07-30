"use client";

import { AIFunnelEventController } from "@/components/analytics/AIFunnelEventController";
import { AIOfficeAccessibilityController } from "@/components/sections/AIOfficeAccessibilityController";
import type { AIService } from "@/lib/ai/service-domain";

export function AIOfficeControllers({
  service,
}: {
  service: AIService | null;
}) {
  return (
    <>
      {service ? (
        <AIFunnelEventController service={service} />
      ) : (
        <AIFunnelEventController />
      )}
      <AIOfficeAccessibilityController />
    </>
  );
}
