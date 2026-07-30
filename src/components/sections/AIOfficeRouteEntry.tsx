"use client";

import { AIOfficeExperience } from "@/components/sections/AIOfficeExperience";
import { useAIServicePreset } from "@/hooks/useAIServicePreset";

export function AIOfficeRouteEntry() {
  const servicePreset = useAIServicePreset();

  return <AIOfficeExperience servicePreset={servicePreset} />;
}
