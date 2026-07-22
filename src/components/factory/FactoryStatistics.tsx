import { TrendingUp, Users, Cpu, CheckCircle2, Building2, Factory } from "lucide-react";

import type { STATISTICS } from "@/content/factory";

const ICON_MAP: Record<string, any> = {
  "building-2": Building2,
  factory: Factory,
  users: Users,
  cpu: Cpu,
  "check-circle-2": CheckCircle2,
  "trending-up": TrendingUp,
};

export function FactoryStatistics({ data }: { data: typeof STATISTICS }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Statistics</p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-900">Những con số ấn tượng</h2>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((stat) => {
          const IconComponent = ICON_MAP[stat.icon] || Building2;

          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                  <IconComponent className="h-6 w-6 text-[#FF5722]" />
                </div>
              </div>
              <p className="mt-6 text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-slate-600">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
