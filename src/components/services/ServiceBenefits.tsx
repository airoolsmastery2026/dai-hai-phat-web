import type { ServiceItem } from "@/types/content";

export function ServiceBenefits({ benefits }: { benefits: ServiceItem["benefits"] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Lợi ích</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {benefits.map((benefit) => (
          <div key={benefit} className="rounded-2xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm">
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
}
