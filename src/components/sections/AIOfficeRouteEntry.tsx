"use client";

import { useSearchParams } from "next/navigation";

import { AIOfficeSection } from "@/components/sections/AIOfficeSection";

export function AIOfficeRouteEntry() {
  const searchParams = useSearchParams();
  const servicePreset = searchParams.get("service");

  return <AIOfficeSection key={servicePreset ?? "no-service-preset"} />;
}
