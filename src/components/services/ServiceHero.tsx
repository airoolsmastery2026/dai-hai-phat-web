import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function ServiceHero({ service }: { service: { title: string; subtitle: string; summary: string; image: string } }) {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Dịch vụ chuyên sâu</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">{service.title}</h1>
            <p className="mt-4 text-lg text-slate-300">{service.subtitle}</p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">{service.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#contact">Yêu cầu báo giá</Button>
              <Button href="#faq" variant="secondary">Xem câu hỏi thường gặp</Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white/10">
            <Image src={service.image} alt={service.title} width={900} height={600} className="h-[420px] w-full object-cover" />
          </div>
        </div>
      </Container>
    </section>
  );
}
