"use client";

import { AIOfficeControllers } from "@/components/sections/AIOfficeControllers";
import { AIOfficeErrorBoundary } from "@/components/sections/AIOfficeErrorBoundary";
import { AIOfficeSection } from "@/components/sections/AIOfficeSection";
import { AIServiceConflictNotice } from "@/components/sections/AIServiceConflictNotice";
import { GeminiLivePanel } from "@/components/sections/GeminiLivePanel";
import { SalesEngineerAgentPanel } from "@/components/sections/SalesEngineerAgentPanel";
import { getAIOfficeSessionKey } from "@/lib/ai/experience";
import type { AIService } from "@/lib/ai/service-domain";

interface AIOfficeExperienceProps {
  servicePreset: AIService | null;
  liveVoiceEnabled: boolean;
}

export function AIOfficeExperience({
  servicePreset,
  liveVoiceEnabled,
}: AIOfficeExperienceProps) {
  const sessionKey = getAIOfficeSessionKey(servicePreset);

  return (
    <>
      <AIOfficeControllers service={servicePreset} />
      <AIServiceConflictNotice requestedService={servicePreset} />
      <AIOfficeErrorBoundary resetKey={sessionKey}>
        <SalesEngineerAgentPanel />
        <AIOfficeSection key={sessionKey} />
        {liveVoiceEnabled ? (
          <GeminiLivePanel servicePreset={servicePreset} />
        ) : null}
      </AIOfficeErrorBoundary>
    </>
  );
}
