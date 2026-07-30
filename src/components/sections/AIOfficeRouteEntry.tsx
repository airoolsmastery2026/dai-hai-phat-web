"use client";

import { useSearchParams } from "next/navigation";

import { AIOfficeAccessibilityController } from "@/components/sections/AIOfficeAccessibilityController";
import { AIOfficeSection } from "@/components/sections/AIOfficeSection";
import { AIServiceConflictNotice } from "@/components/sections/AIServiceConflictNotice";
import { SERVICES } from "@/content/services";

export function AIOfficeRouteEntry() {
  const searchParams = useSearchParams();
  const requestedService = searchParams.get("service");
  const servicePreset =
    SERVICES.find((service) => service.aiService === requestedService)?.aiService ??
    null;

  return (
    <>
      <AIOfficeAccessibilityController />
      <AIServiceConflictNotice requestedService={servicePreset} />
      <AIOfficeSection key={servicePreset ?? "no-service-preset"} />
    </>
  );
}
