import { ShieldCheck } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { COMPANY_STATS } from "@/content/company";
import { HOME_ABOUT_CONTENT } from "@/content/home";

export function AboutSection() {
  const { eyebrow, title, description, badge } = HOME_ABOUT_CONTENT;

  return (
    <section id="about" className="border-b border-slate-200 bg-white py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FF5722]">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            {description}
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            <ShieldCheck className="h-4 w-4 text-[#FF5722]" /> {badge}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {COMPANY_STATS.map((stat) => (
            <div key={stat.label} className="rounded-[16px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
