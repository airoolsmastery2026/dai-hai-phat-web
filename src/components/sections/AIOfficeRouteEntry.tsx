"use client";

import dynamic from "next/dynamic";

import { AIOfficeLoadingState } from "@/components/sections/AIOfficeLoadingState";
import { useAIOfficeActivation } from "@/hooks/useAIOfficeActivation";
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

interface AIOfficeRouteEntryProps {
  liveVoiceEnabled: boolean;
}

export function AIOfficeRouteEntry({
  liveVoiceEnabled,
}: AIOfficeRouteEntryProps) {
  const servicePreset = useAIServicePreset();
  const { activationRef, isActive } = useAIOfficeActivation();

  return (
    <div ref={activationRef}>
      {isActive ? (
        <AIOfficeExperience
          servicePreset={servicePreset}
          liveVoiceEnabled={liveVoiceEnabled}
        />
      ) : (
        <AIOfficeLoadingState />
      )}
    </div>
  );
}
