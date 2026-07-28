import type { ServiceItem } from "@/types/content";

export function ServiceOverview({ service }: { service: ServiceItem }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
        Tổng quan
      </p>
      <h2 className="mt-[var(--space-3)] text-3xl font-bold text-[var(--color-text)]">
        Về giải pháp này
      </h2>
      <p className="mt-[var(--space-5)] text-base leading-8 text-[var(--color-text-muted)]">
        {service.fullDescription}
      </p>
    </div>
  );
}
