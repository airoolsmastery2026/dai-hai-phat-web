import { CheckCircle2 } from "lucide-react";

import type { ServiceItem } from "@/types/content";

export function ServiceBenefits({ benefits }: { benefits: ServiceItem["benefits"] }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 md:p-10 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Lợi ích chính</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {benefits.map((benefit) => (
          <div
            key={benefit}
            className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">{benefit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
