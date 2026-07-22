import { MapPin, Award, Zap, CheckCircle2 } from "lucide-react";

import type { FACTORY_OVERVIEW } from "@/content/factory";

export function FactoryOverview({ data }: { data: typeof FACTORY_OVERVIEW }) {
  const icons = [
    { icon: CheckCircle2, color: "text-green-600" },
    { icon: Award, color: "text-blue-600" },
    { icon: Zap, color: "text-yellow-600" },
    { icon: MapPin, color: "text-purple-600" },
  ];

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Factory Overview</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">{data.name}</h2>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            <span>{data.location} • Thành lập {data.established}</span>
          </div>
          <p className="mt-6 text-base leading-8 text-slate-700">{data.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {data.highlights.map((highlight, index) => {
            const IconComponent = icons[index]?.icon || CheckCircle2;
            const colorClass = icons[index]?.color || "text-slate-600";

            return (
              <div key={highlight} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-opacity-10 ${colorClass}`}>
                  <IconComponent className={`h-5 w-5 ${colorClass}`} />
                </div>
                <p className="mt-4 font-semibold text-slate-900">{highlight}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
