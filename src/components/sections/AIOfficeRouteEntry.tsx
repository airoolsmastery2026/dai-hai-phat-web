"use client";

import dynamic from "next/dynamic";

import { AIOfficeLoadingState } from "@/components/sections/AIOfficeLoadingState";
import { useAIServicePreset } from "@/hooks/useAIServicePreset";

const AIOfficeExperience = dynamic(
  () =>
    import("@/components/sections/AIOfficeExperience").then(
      (module) => module.AIOfficeExperience,
    ),
  {
    loading: AIOfficeLoadingState,
  },
);

export function AIOfficeRouteEntry() {
  const servicePreset = useAIServicePreset();

  return <AIOfficeExperience servicePreset={servicePreset} />;
}
