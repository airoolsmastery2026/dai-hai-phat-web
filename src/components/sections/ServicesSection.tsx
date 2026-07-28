import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/content/services";

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
            Chọn một dịch vụ để xem phạm vi, vật liệu và quy trình trước khi
            khảo sát.
          </p>
        </div>

        <div className="mt-[var(--space-10)] grid gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((service) => (
            <article
              key={service.id}
              className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-5)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)]"
            >
              <h3 className="text-lg font-bold text-[var(--color-text)]">
                {service.title}
              </h3>
              <p className="mt-[var(--space-3)] text-sm leading-7 text-[var(--color-text-muted)]">
                {service.summary}
              </p>
              <a
                href={`/services/${service.slug}`}
                className="mt-[var(--space-5)] inline-flex min-h-11 items-center gap-[var(--space-2)] text-sm font-bold text-[var(--color-primary)]"
              >
                Xem chi tiết <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
