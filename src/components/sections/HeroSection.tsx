import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

const STATS = [
  {
    value: "300+",
    label: "Công trình",
  },
  {
    value: "10+",
    label: "Năm kinh nghiệm",
  },
  {
    value: "100%",
    label: "Đúng tiến độ",
  },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950">
      <Image
        src="/images/hero-factory.jpg"
        alt={COMPANY_CONFIG.name}
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/65" />

      <Container className="relative z-10 flex min-h-[92vh] items-center py-24">
        <div className="max-w-3xl">

          <span className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
            CÔNG TY CƠ KHÍ XÂY DỰNG
          </span>

          <h1 className="mt-8 text-5xl font-black uppercase leading-[1.05] tracking-tight text-white md:text-7xl">
            {COMPANY_CONFIG.name}
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-300">
            Chuyên thi công kết cấu thép, nhà xưởng, mái che,
            cầu thang, lan can và gia công cơ khí với tiêu chuẩn
            chất lượng cao, đúng tiến độ và tối ưu chi phí.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <a
              href="#contact"
              className="rounded-xl bg-orange-500 px-8 py-4 text-base font-bold uppercase text-white transition hover:bg-orange-600"
            >
              Nhận báo giá
            </a>

            <a
              href="#projects"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-bold uppercase text-white backdrop-blur hover:bg-white/10"
            >
              Xem dự án
            </a>

          </div>

          <div className="mt-20 grid grid-cols-3 gap-8 border-t border-white/10 pt-10">

            {STATS.map((item) => (
              <div key={item.label}>
                <div className="text-4xl font-black text-orange-500">
                  {item.value}
                </div>

                <div className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">
                  {item.label}
                </div>
              </div>
            ))}

          </div>

        </div>
      </Container>
    </section>
  );
}
