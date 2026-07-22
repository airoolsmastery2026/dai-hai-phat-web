import { Cpu } from "lucide-react";

import type { MACHINERY } from "@/content/factory";

export function Machinery({ data }: { data: typeof MACHINERY }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Machinery</p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-900">Hệ thống máy móc</h2>
      <p className="mt-3 max-w-2xl text-base text-slate-600">Trang bị công nghệ gia công CNC, hàn robot và xử lý bề mặt hiện đại.</p>

      <div className="mt-10 space-y-8">
        {data.map((category, categoryIndex) => (
          <div key={categoryIndex} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF5722] text-white">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{category.category}</h3>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {category.items.map((item) => (
                <div key={item.name} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.name}</h4>
                      <p className="mt-1 text-sm text-slate-600">{item.spec}</p>
                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-[#FF5722]">{item.purpose}</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">{item.count}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
