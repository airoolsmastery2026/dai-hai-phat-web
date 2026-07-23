import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/content/services";

export function ServicesSection() {
  return (
    <section id="services" className="border-b border-slate-200 bg-white py-20 lg:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FF5722]">Dịch vụ</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            Chúng tôi triển khai các hạng mục thực tế, từ kết cấu đến hoàn thiện.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((service) => (
            <article key={service.id} className="rounded-[16px] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.summary}</p>
              <a href={`/services/${service.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#FF5722]">
                Xem chi tiết <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
