"use client";

import { AIOfficeControllers } from "@/components/sections/AIOfficeControllers";
import { AIOfficeSection } from "@/components/sections/AIOfficeSection";
import { AIServiceConflictNotice } from "@/components/sections/AIServiceConflictNotice";
import type { AIService } from "@/lib/ai/service-domain";

interface AIOfficeExperienceProps {
  servicePreset: AIService | null;
}

export function AIOfficeExperience({ servicePreset }: AIOfficeExperienceProps) {
  return (
    <>
      <AIOfficeControllers service={servicePreset} />
      <AIServiceConflictNotice requestedService={servicePreset} />
      <AIOfficeSection key={servicePreset ?? "no-service-preset"} />
    </>
  );
}
