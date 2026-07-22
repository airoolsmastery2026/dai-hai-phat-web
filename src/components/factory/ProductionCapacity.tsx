import { Zap, Users, Cpu } from "lucide-react";

import type { PRODUCTION_CAPACITY } from "@/content/factory";

export function ProductionCapacity({ data }: { data: typeof PRODUCTION_CAPACITY }) {
  const metrics = [
    { label: data.monthly, description: "Năng lực sản xuất hàng tháng", icon: Zap, color: "bg-orange-50 text-orange-600" },
    { label: data.daily, description: "Năng lực sản xuất hàng ngày", icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: data.workforce, description: "Nhân viên quản lý & sản xuất", icon: Users, color: "bg-green-50 text-green-600" },
    { label: data.machineCount, description: "Máy gia công và thiết bị", icon: Cpu, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Production Capacity</p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-900">Năng lực sản xuất</h2>
      <p className="mt-3 max-w-2xl text-base text-slate-600">{data.description}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const [bgClass, textClass] = metric.color.split(" ");

          return (
            <div key={metric.label} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${bgClass}`}>
                <Icon className={`h-6 w-6 ${textClass}`} />
              </div>
              <p className="mt-4 text-2xl font-semibold text-slate-900">{metric.label}</p>
              <p className="mt-2 text-sm text-slate-600">{metric.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
