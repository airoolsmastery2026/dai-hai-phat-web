"use client";

import { AIOfficeControllers } from "@/components/sections/AIOfficeControllers";
import { AIOfficeSection } from "@/components/sections/AIOfficeSection";
import { AIServiceConflictNotice } from "@/components/sections/AIServiceConflictNotice";
import { useAIServicePreset } from "@/hooks/useAIServicePreset";

export function AIOfficeRouteEntry() {
  const servicePreset = useAIServicePreset();

  return (
    <>
      <AIOfficeControllers service={servicePreset} />
      <AIServiceConflictNotice requestedService={servicePreset} />
      <AIOfficeSection key={servicePreset ?? "no-service-preset"} />
    </>
  );
}
