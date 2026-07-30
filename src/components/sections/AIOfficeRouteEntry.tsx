"use client";

import { useSearchParams } from "next/navigation";

import { AIOfficeControllers } from "@/components/sections/AIOfficeControllers";
import { AIOfficeSection } from "@/components/sections/AIOfficeSection";
import { AIServiceConflictNotice } from "@/components/sections/AIServiceConflictNotice";
import { getAIService } from "@/lib/ai/service-domain";

export function AIOfficeRouteEntry() {
  const searchParams = useSearchParams();
  const servicePreset = getAIService(searchParams.get("service"));

  return (
    <>
      <AIOfficeControllers service={servicePreset} />
      <AIServiceConflictNotice requestedService={servicePreset} />
      <AIOfficeSection key={servicePreset ?? "no-service-preset"} />
    </>
  );
}
