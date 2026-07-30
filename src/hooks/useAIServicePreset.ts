"use client";

import { useSearchParams } from "next/navigation";

import { getAIService, type AIService } from "@/lib/ai/service-domain";

export function useAIServicePreset(): AIService | null {
  const searchParams = useSearchParams();
  return getAIService(searchParams.get("service"));
}
