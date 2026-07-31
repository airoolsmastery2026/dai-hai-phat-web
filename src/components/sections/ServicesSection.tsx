import { ArrowRight, Bot } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/content/services";
import { getPublicRouteSlug } from "@/lib/routing";

export function ServicesSection() {
  return (
    <section
      id="services"
      className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-[var(--space-section)] lg:py-[var(--space-section-lg)]"
    >
      <Container>
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Chọn hạng mục
          </p>
          <h2 className="mt-[var(--space-3)] text-3xl font-bold leading-tight text-[var(--color-text)] sm:text-4xl">
            Bạn đang cần tư vấn hạng mục nào?
          </h2>
          <p className="mt-[var(--space-4)] text-[var(--color-text-muted)]">
            Bắt đầu hồ sơ tư vấn ngay hoặc xem phạm vi, vật liệu và quy trình
            trước khi khảo sát.
          </p>
        </div>

        <div className="mt-[var(--space-10)] grid gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((service) => {
            const aiHref = `/?service=${encodeURIComponent(service.aiService)}#ai-office`;
            const serviceHref = `/services/${getPublicRouteSlug(service.slug)}`;

            return (
              <article
                key={service.id}
                className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-5)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)]"
              >
                <h3 className="text-lg font-bold text-[var(--color-text)]">
                  {service.title}
                </h3>
                <p className="mt-[var(--space-3)] text-sm leading-7 text-[var(--color-text-muted)]">
                  {service.summary}
                </p>
                <div className="mt-auto grid gap-[var(--space-3)] pt-[var(--space-5)]">
                  <Link
                    href={aiHref}
                    aria-label={`Tư vấn ${service.title} bằng AI`}
                    className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-4)] py-[var(--space-3)] text-center text-sm font-bold text-white transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <Bot className="h-4 w-4" aria-hidden="true" />
                    Tư vấn hạng mục
                  </Link>
                  <Link
                    href={serviceHref}
                    aria-label={`Xem chi tiết ${service.title}`}
                    className="inline-flex min-h-11 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] text-sm font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
