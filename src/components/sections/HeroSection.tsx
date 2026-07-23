import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-factory.jpg"
          alt={COMPANY_CONFIG.name}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-slate-950/70" />

      <Container className="relative z-10 py-24 sm:py-28 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-orange-400">
              Công ty cơ khí xây dựng
            </p>

            <h1 className="mt-8 text-5xl font-black uppercase leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {COMPANY_CONFIG.name}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Thi công kết cấu thép, nhà xưởng, mái che và gia công cơ khí
              theo phương án thực tế, đúng tiến độ và tối ưu chi phí.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-8 py-4 text-sm font-bold uppercase text-white transition hover:bg-orange-600"
              >
                Nhận báo giá
              </a>

              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold uppercase text-white transition hover:bg-white/10"
              >
                Xem dự án
              </a>
            </div>

            <div className="mt-14 grid max-w-xl grid-cols-3 gap-5 border-t border-white/10 pt-8">
              <Stat value="15+" label="Năm kinh nghiệm" />
              <Stat value="300+" label="Công trình" />
              <Stat value="100%" label="Đúng tiến độ" />
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur">
              <Image
                src="/images/hero-factory.jpg"
                alt={`${COMPANY_CONFIG.name} - nhà xưởng và công trình`}
                width={1200}
                height={1400}
                className="h-[520px] w-full object-cover sm:h-[620px] lg:h-[700px]"
              />
            </div>

            <div className="absolute -bottom-6 left-6 rounded-2xl border border-white/10 bg-slate-950/90 px-5 py-4 shadow-xl shadow-black/30 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Năng lực thi công
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Nhà xưởng • Kết cấu thép • Mái che • Gia công cơ khí
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-black text-orange-400 sm:text-4xl">
        {value}
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
        {label}
      </div>
    </div>
  );
}
