"use client";

import { useMemo } from "react";

import { KnowledgeProvider, QuotationProvider } from "@/lib/ai";

export function useAI() {
  const knowledgeProvider = useMemo(() => new KnowledgeProvider(), []);
  const quotationProvider = useMemo(() => new QuotationProvider(), []);

  return {
    knowledgeProvider,
    quotationProvider,
  };
}
