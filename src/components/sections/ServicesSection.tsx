import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/content/services";

export function ServicesSection() {
  return (
    <section id="services" className="border-b border-slate-200 bg-white py-20 lg:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FF5722]">Services</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            Thi công thực tế, vận hành bền vững và quản lý chất lượng chặt chẽ.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.slice(0, 6).map((service) => {
            const IconComp = service.icon;
            return (
              <div key={service.id} className="rounded-[16px] border border-slate-200 bg-slate-50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
                  <IconComp className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{service.summary}</p>
                <a href={`/services/${service.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#FF5722]">
                  Xem chi tiết <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
