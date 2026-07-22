import { CheckCircle2 } from "lucide-react";

import type { QUALITY_CONTROL } from "@/content/factory";

export function QualityControl({ data }: { data: typeof QUALITY_CONTROL }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Quality Control</p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-900">Kiểm soát chất lượng</h2>
      <p className="mt-3 max-w-2xl text-base text-slate-600">Quy trình kiểm tra 360° đảm bảo sản phẩm đạt tiêu chuẩn ISO 9001:2015.</p>

      <div className="mt-10 space-y-4">
        {data.map((item) => (
          <div key={item.name} className="grid gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:grid-cols-[120px_1fr_140px_140px]">
            <div className="flex items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.method}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tần suất</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{item.frequency}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tiêu chuẩn</p>
              <p className="mt-2 text-sm font-medium text-[#FF5722]">{item.tolerance}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
