"use client";

import { Zap } from "lucide-react";

import type { ServiceFeature as ServiceFeatureType } from "@/types/content";

export function ServiceFeature({ feature }: { feature: ServiceFeatureType }) {
  return (
    <div className="group relative rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm transition hover:border-[#FF5722]/30 hover:shadow-md">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722]">
        <Zap className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{feature.description}</p>
    </div>
  );
}
