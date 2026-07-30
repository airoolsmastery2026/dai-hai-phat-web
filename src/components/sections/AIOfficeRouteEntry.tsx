"use client";

import { useSearchParams } from "next/navigation";

import { AIOfficeAccessibilityController } from "@/components/sections/AIOfficeAccessibilityController";
import { AIOfficeSection } from "@/components/sections/AIOfficeSection";

export function AIOfficeRouteEntry() {
  const searchParams = useSearchParams();
  const servicePreset = searchParams.get("service");

  return (
    <>
      <AIOfficeAccessibilityController />
      <AIOfficeSection key={servicePreset ?? "no-service-preset"} />
    </>
  );
}
