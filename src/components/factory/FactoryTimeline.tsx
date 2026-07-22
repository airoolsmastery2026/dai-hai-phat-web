import type { FACTORY_TIMELINE } from "@/content/factory";

export function FactoryTimeline({ data }: { data: typeof FACTORY_TIMELINE }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Timeline</p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-900">Hành trình phát triển</h2>
      <p className="mt-3 max-w-2xl text-base text-slate-600">Từ thành lập đến mở rộng quy mô, Đại Hải Phát luôn nâng cao năng lực.</p>

      <div className="mt-10 space-y-0">
        {data.map((item, index) => (
          <div key={item.year} className="grid gap-6 border-l-2 border-[#FF5722] py-8 pl-8 md:grid-cols-[160px_1fr]">
            <div>
              <div className="absolute -left-4 top-8 h-6 w-6 rounded-full border-4 border-white bg-[#FF5722] shadow-lg" />
              <p className="text-2xl font-bold text-[#FF5722]">{item.year}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">{item.event}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
