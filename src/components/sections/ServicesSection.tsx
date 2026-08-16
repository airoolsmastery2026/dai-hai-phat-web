import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/content/services";

const SERVICE_TONES = [
  {
    surface: "bg-[var(--color-primary-soft)]",
    border: "border-[var(--color-primary)]",
    accent: "text-[var(--color-primary-soft-text)]",
    icon: "bg-[var(--color-surface)] text-[var(--color-primary)]",
  },
  {
    surface: "bg-[var(--color-metal-soft)]",
    border: "border-[var(--color-metal)]",
    accent: "text-[var(--color-metal-strong)]",
    icon: "bg-[var(--color-surface)] text-[var(--color-metal-strong)]",
  },
  {
    surface: "bg-[var(--color-surface-muted)]",
    border: "border-[var(--color-border)]",
    accent: "text-[var(--color-primary)]",
    icon: "bg-[var(--color-surface)] text-[var(--color-primary)]",
  },
  {
    surface: "bg-[var(--color-wood-soft)]",
    border: "border-[var(--color-wood)]",
    accent: "text-[var(--color-wood)]",
    icon: "bg-[var(--color-surface)] text-[var(--color-wood)]",
  },
] as const;

export function ServicesSection() {
  return (
    <section
      id="services"
      className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-[var(--space-6)] sm:py-[var(--space-8)] lg:py-[var(--space-10)]"
    >
      <Container>
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
            Hạng mục chính
          </p>
          <h2 className="mt-[var(--space-2)] text-[length:var(--font-h2)] font-bold leading-tight text-[var(--color-text)]">
            Chọn nhanh hạng mục bạn quan tâm
          </h2>
          <p className="mt-[var(--space-2)] max-w-xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
            Mỗi lựa chọn mở đúng luồng tư vấn của hạng mục, giúp trao đổi ngắn gọn và giữ thông tin liền mạch.
          </p>
        </div>

        <div className="mt-[var(--space-4)] grid grid-cols-2 gap-[var(--space-2)] sm:gap-[var(--space-3)] lg:grid-cols-4">
          {SERVICES.slice(0, 4).map((service, index) => {
            const consultationHref = `/ai-tu-van?service=${encodeURIComponent(service.aiService)}&ai=1`;
            const ServiceIcon = service.icon;
            const tone = SERVICE_TONES[index % SERVICE_TONES.length];
            const tickerText = [service.subtitle, ...service.benefits.slice(0, 3)].join(" · ");

            return (
              <Link
                key={service.id}
                href={consultationHref}
                aria-label={`Bắt đầu tư vấn ${service.title}`}
                className={`service-choice group relative flex min-h-[9rem] overflow-hidden rounded-[var(--radius-lg)] border p-[var(--space-3)] shadow-[var(--shadow-sm)] transition duration-[var(--duration-medium)] ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)] focus-visible:-translate-y-1 focus-visible:shadow-[var(--shadow-md)] sm:min-h-[9.5rem] sm:p-[var(--space-4)] ${tone.surface} ${tone.border}`}
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-[var(--space-2)]">
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] sm:size-10 ${tone.icon}`}>
                      <ServiceIcon className="size-4 sm:size-5" aria-hidden="true" />
                    </span>
                    <ArrowRight
                      className={`size-4 shrink-0 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1 group-focus-visible:translate-x-1 ${tone.accent}`}
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-[var(--space-3)] line-clamp-2 text-sm font-extrabold leading-5 text-[var(--color-text)] sm:text-base sm:leading-6">
                    {service.aiService}
                  </h3>

                  <span className="sr-only">{service.subtitle}. {service.summary}</span>

                  <div
                    className="mt-auto overflow-hidden border-t border-current/15 pt-[var(--space-2)] text-[11px] font-semibold leading-5 text-[var(--color-text-muted)] sm:text-xs"
                    aria-hidden="true"
                  >
                    <div className="service-ticker-track">
                      <span className="service-ticker-copy">{tickerText}</span>
                      <span className="service-ticker-copy">{tickerText}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-[var(--space-3)] flex justify-end">
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-3)] text-sm font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Xem đầy đủ dịch vụ
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
