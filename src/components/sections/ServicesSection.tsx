import { ArrowRight, MessageCircle } from "lucide-react";
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
              Chọn đúng nhu cầu, xem nhanh giải pháp
            </h2>
            <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
              Phạm vi rõ ràng, vật liệu dễ đối chiếu và có kỹ sư tiếp nhận khi cần khảo sát.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-11 w-fit items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-4)] py-[var(--space-2)] text-sm font-bold text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Nhờ kỹ sư tư vấn
          </Link>
        </div>

        <div className="mt-[var(--space-5)] grid gap-[var(--space-3)] sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.slice(0, 4).map((service) => {
            const serviceHref = `/services/${getPublicRouteSlug(service.slug)}`;

            return (
              <Link
                key={service.id}
                href={serviceHref}
                aria-label={`Xem chi tiết ${service.title}`}
                className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)] transition duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:border-[var(--color-metal)] hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <h3 className="text-base font-bold leading-6 text-[var(--color-text)]">
                  {service.title}
                </h3>
                <p className="mt-[var(--space-2)] line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {service.summary}
                </p>
                <span className="mt-auto inline-flex items-center gap-[var(--space-2)] pt-[var(--space-3)] text-sm font-bold text-[var(--color-primary)]">
                  Xem hạng mục
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
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
