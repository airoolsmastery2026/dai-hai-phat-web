import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function ServiceHero({ service }: { service: { title: string; subtitle: string; summary: string; image: string } }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-50 py-32 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#FF5722]/10 blur-3xl" />
        <div className="absolute top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <Container>
        <div className="relative grid items-center gap-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Premium Service</p>
            <h1 className="mt-6 text-5xl font-bold leading-tight sm:text-6xl">{service.title}</h1>
            <p className="mt-6 text-xl text-slate-200">{service.subtitle}</p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">{service.summary}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="#contact">Yêu cầu báo giá</Button>
              <Button href="#faq" variant="secondary">
                Xem FAQ
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#FF5722]/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
              <Image src={service.image} alt={service.title} width={900} height={600} className="h-[500px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
