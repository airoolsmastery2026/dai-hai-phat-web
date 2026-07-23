import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

export function HeroSection() {
  return (
    <section className="border-b border-slate-200 bg-white py-20 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FF5722]">Đối tác thi công cơ khí</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {COMPANY_CONFIG.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Thi công kết cấu thép, nhà thép tiền chế, mái che và gia công cơ khí theo phương án thực tế, đúng tiến độ và phù hợp với điều kiện vận hành.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-[#FF5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
              Yêu cầu báo giá
            </a>
            <a href="#projects" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#FF5722] hover:text-[#FF5722]">
              Xem dự án
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100">
          <Image src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80" alt="Công trường thi công kết cấu thép" width={1400} height={900} priority sizes="(max-width: 1024px) 100vw, 50vw" className="h-[420px] w-full object-cover sm:h-[520px]" />
        </div>
      </Container>
    </section>
  );
}
