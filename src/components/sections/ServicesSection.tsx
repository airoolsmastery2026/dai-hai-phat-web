import { ArrowRight, Bot } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/content/services";
import { getPublicRouteSlug } from "@/lib/routing";

export function ServicesSection() {
  return (
    <section
      id="services"
      className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]"
    >
      <Container>
        <div className="flex flex-col gap-[var(--space-4)] lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
              Hạng mục chính
            </p>
            <h2 className="mt-[var(--space-2)] text-[length:var(--font-h2)] font-bold leading-tight text-[var(--color-text)]">
              Chọn đúng nhu cầu, bắt đầu tư vấn ngay
            </h2>
            <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
              Trợ lý AI ghi nhận nhu cầu theo từng hạng mục, giữ ngữ cảnh hồ sơ và chuyển tiếp để kỹ sư xác minh khi cần.
            </p>
          </div>
          <Link
            href="/#ai-office"
            className="inline-flex min-h-11 w-fit items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-4)] py-[var(--space-2)] text-sm font-bold text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            <Bot className="h-4 w-4" aria-hidden="true" />
            Mở trợ lý AI
          </Link>
        </div>

        <div className="mt-[var(--space-5)] grid gap-[var(--space-3)] sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.slice(0, 4).map((service) => {
            const aiHref = `/?service=${encodeURIComponent(service.aiService)}#ai-office`;
            const serviceHref = `/services/${getPublicRouteSlug(service.slug)}`;
            const ServiceIcon = service.icon;

            return (
              <article
                key={service.id}
                className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)] transition duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:border-[var(--color-metal)] hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex items-start gap-[var(--space-3)]">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary-soft-text)]">
                    <ServiceIcon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="pt-[var(--space-2)] text-base font-bold leading-6 text-[var(--color-text)]">
                    {service.title}
                  </h3>
                </div>
                <p className="mt-[var(--space-2)] line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {service.summary}
                </p>
                <div className="mt-auto grid gap-[var(--space-2)] pt-[var(--space-3)]">
                  <Link
                    href={aiHref}
                    aria-label={`Tư vấn ${service.title} với trợ lý AI`}
                    className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-4)] py-[var(--space-2)] text-center text-sm font-bold text-[var(--color-primary-contrast)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <Bot className="h-4 w-4" aria-hidden="true" />
                    Tư vấn hạng mục
                  </Link>
                  <Link
                    href={serviceHref}
                    aria-label={`Xem chi tiết ${service.title}`}
                    className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] text-sm font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-[var(--space-4)] text-center">
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] text-sm font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Xem tất cả hạng mục
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
