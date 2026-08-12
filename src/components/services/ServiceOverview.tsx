import type { ServiceItem } from "@/types/content";

export function ServiceOverview({ service }: { service: ServiceItem }) {
  return (
    <section aria-labelledby="service-overview-title">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
        Tổng quan
      </p>
      <h2 id="service-overview-title" className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)]">
        Phạm vi giải pháp
      </h2>
      <p className="mt-[var(--space-3)] max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
        {service.fullDescription}
      </p>
    </section>
  );
}
