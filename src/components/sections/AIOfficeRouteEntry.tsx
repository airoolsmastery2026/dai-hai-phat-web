"use client";

import { useSearchParams } from "next/navigation";

import { AIFunnelEventController } from "@/components/analytics/AIFunnelEventController";
import { AIOfficeAccessibilityController } from "@/components/sections/AIOfficeAccessibilityController";
import { AIOfficeSection } from "@/components/sections/AIOfficeSection";
import { AIServiceConflictNotice } from "@/components/sections/AIServiceConflictNotice";
import { getAIService } from "@/lib/ai/service-domain";

export function AIOfficeRouteEntry() {
  const searchParams = useSearchParams();
  const servicePreset = getAIService(searchParams.get("service"));

  return (
    <>
      <AIFunnelEventController service={servicePreset ?? undefined} />
      <AIOfficeAccessibilityController />
      <AIServiceConflictNotice requestedService={servicePreset} />
      <AIOfficeSection key={servicePreset ?? "no-service-preset"} />
    </>
  );
}
