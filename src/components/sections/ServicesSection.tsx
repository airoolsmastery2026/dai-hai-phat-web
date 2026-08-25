import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/content/services";

const SERVICE_TONES = [
  "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]",
  "bg-[var(--color-wood)] text-[var(--color-primary-contrast)]",
  "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]",
  "bg-[var(--color-wood)] text-[var(--color-primary-contrast)]",
] as const;

export function ServicesSection() {
  return (
    <section
      id="services"
      className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-[var(--space-6)] sm:py-[var(--space-8)] lg:py-[var(--space-10)]"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-[var(--space-3)]">
            <span className="hidden h-px w-10 bg-[var(--color-metal)] sm:block" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wood)]">
              Dịch vụ nổi bật
            </p>
            <span className="hidden h-px w-10 bg-[var(--color-metal)] sm:block" aria-hidden="true" />
          </div>
          <h2 className="mt-[var(--space-2)] text-[length:var(--font-h2)] font-bold leading-tight text-[var(--color-text)]">
            Chọn nhanh hạng mục bạn quan tâm
          </h2>
          <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
            Giải pháp đồng bộ cho không gian của bạn, từ thiết kế đến hoàn thiện.
          </p>
        </div>

        <div className="mt-[var(--space-5)] grid grid-cols-2 gap-[var(--space-2)] sm:gap-[var(--space-3)] lg:grid-cols-4">
          {SERVICES.slice(0, 4).map((service, index) => {
            const consultationHref = `/ai-tu-van?service=${encodeURIComponent(service.aiService)}&ai=1`;
            const ServiceIcon = service.icon;
            const tone = SERVICE_TONES[index % SERVICE_TONES.length];

            return (
              <Link
                key={service.id}
                href={consultationHref}
                aria-label={`Bắt đầu tư vấn ${service.title}`}
                className="group relative min-h-[12rem] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition duration-[var(--duration-medium)] ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)] focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] sm:min-h-[13rem]"
              >
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[var(--duration-medium)] group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.9)_45%,rgba(255,255,255,0.18)_82%,transparent_100%)]"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex h-full min-h-[12rem] flex-col p-[var(--space-3)] sm:min-h-[13rem] sm:p-[var(--space-4)]">
                  <span className={`flex size-10 items-center justify-center rounded-[var(--radius-full)] shadow-[var(--shadow-sm)] ${tone}`}>
                    <ServiceIcon className="size-5" aria-hidden="true" />
                  </span>

                  <div className="mt-[var(--space-3)] max-w-[80%]">
                    <h3 className="text-sm font-black leading-5 text-[var(--color-text)] sm:text-base sm:leading-6">
                      {service.aiService}
                    </h3>
                    <p className="mt-[var(--space-1)] line-clamp-3 text-[11px] leading-5 text-[var(--color-text-muted)] sm:text-xs">
                      {service.desc}
                    </p>
                  </div>

                  <span className="mt-auto ml-auto flex size-10 items-center justify-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-sm)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1" aria-hidden="true">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-[var(--space-3)] flex justify-center">
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-3)] text-sm font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Xem tất cả dịch vụ
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
