import { Container } from "@/components/ui/Container";
import { COMPANY_STATS } from "@/content/company";

export function StatsSection() {
  return (
    <section className="border-b border-slate-200 bg-white py-10">
      <Container>
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {COMPANY_STATS.map((stat, idx) => (
            <div key={`${stat.label}-${idx}`} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-1 text-3xl font-extrabold text-[#FF5722] md:text-4xl">{stat.value}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
