import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

const highlights = ["Thi công kết cấu thép", "Nhà xưởng", "Mái che", "Cầu trục", "Gia công cơ khí"];

export function HeroSection() {
  return (
    <section className="border-b border-slate-200 bg-white py-20 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FF5722]">Mechanical Construction Company</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {COMPANY_CONFIG.name}
          </h1>
          <ul className="mt-6 grid gap-2 text-base text-slate-600 sm:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="rounded-lg border border-slate-200 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
              Nhận báo giá <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#projects" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#FF5722] hover:text-[#FF5722]">
              Xem dự án
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100">
          <Image src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80" alt={COMPANY_CONFIG.name} width={1200} height={800} priority className="h-[420px] w-full object-cover sm:h-[520px]" />
        </div>
      </Container>
    </section>
  );
}
