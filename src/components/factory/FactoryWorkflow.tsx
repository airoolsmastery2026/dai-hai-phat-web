import type { WORKFLOW } from "@/content/factory";

export function FactoryWorkflow({ data }: { data: typeof WORKFLOW }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Workflow</p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-900">Quy trình sản xuất</h2>
      <p className="mt-3 max-w-2xl text-base text-slate-600">Từ khảo sát đến bàn giao sản phẩm, mỗi bước được kiểm soát chặt chẽ.</p>

      <div className="mt-10 space-y-4">
        {data.map((step) => (
          <div key={step.step} className="grid gap-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 md:grid-cols-[120px_1fr_180px]">
            <div className="flex items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF5722] font-semibold text-white">
                {step.step}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">{step.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>

            <div className="flex flex-col items-start justify-center md:items-end">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Khoảng thời gian</span>
              <span className="mt-1 text-lg font-semibold text-[#FF5722]">{step.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
