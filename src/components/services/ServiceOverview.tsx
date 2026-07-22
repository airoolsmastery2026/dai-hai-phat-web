import type { ServiceItem } from "@/types/content";

export function ServiceOverview({ service }: { service: ServiceItem }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Tổng quan</p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">Về giải pháp này</h2>
      <p className="mt-5 text-base leading-8 text-slate-600">{service.fullDescription}</p>
    </div>
  );
}
