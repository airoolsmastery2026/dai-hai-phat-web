import Image from "next/image";
import Link from "next/link";
import type { ServiceItem } from "@/types/content";

export function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition duration-[var(--duration-medium)] hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-md)]"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          width={800}
          height={224}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-[var(--space-6)]">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
          {service.subtitle}
        </p>
        <h2 className="mt-[var(--space-3)] text-xl font-bold text-[var(--color-text)]">
          {service.title}
        </h2>
        <p className="mt-[var(--space-3)] text-sm leading-7 text-[var(--color-text-muted)]">
          {service.summary}
        </p>
      </div>
    </Link>
  );
}
