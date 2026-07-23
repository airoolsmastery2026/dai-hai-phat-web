import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";
import { HOME_HERO_CONTENT } from "@/content/home";

export function HeroSection() {
  const { eyebrow, title, highlights, primaryCtaLabel, primaryCtaHref, secondaryCtaLabel, secondaryCtaHref, imageAlt } = HOME_HERO_CONTENT;

  return (
    <section className="border-b border-slate-200 bg-white py-20 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FF5722]">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {COMPANY_CONFIG.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{title}</p>
          <ul className="mt-6 grid gap-2 text-base text-slate-600 sm:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="rounded-lg border border-slate-200 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={primaryCtaHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
              {primaryCtaLabel} <ArrowRight className="h-4 w-4" />
            </a>
            <a href={secondaryCtaHref} className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#FF5722] hover:text-[#FF5722]">
              {secondaryCtaLabel}
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100">
          <Image src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80" alt={imageAlt} width={1200} height={800} priority sizes="(max-width: 1024px) 100vw, 50vw" className="h-[420px] w-full object-cover sm:h-[520px]" />
        </div>
      </Container>
    </section>
  );
}
