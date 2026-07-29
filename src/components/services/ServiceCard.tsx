import { ArrowRight, Bot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { ServiceItem } from "@/types/content";

export function ServiceCard({ service }: { service: ServiceItem }) {
  const aiHref = `/?service=${encodeURIComponent(service.aiService)}#ai-office`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition duration-[var(--duration-medium)] hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-md)]">
      <Link
        href={`/services/${service.slug}`}
        aria-label={`Xem chi tiết ${service.title}`}
        className="relative block h-56 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus)]"
      >
        <Image
          src={service.image}
          alt={service.title}
          width={800}
          height={224}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-[var(--space-6)]">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
          {service.subtitle}
        </p>
        <h2 className="mt-[var(--space-3)] text-xl font-bold text-[var(--color-text)]">
          <Link
            href={`/services/${service.slug}`}
            className="rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            {service.title}
          </Link>
        </h2>
        <p className="mt-[var(--space-3)] text-sm leading-7 text-[var(--color-text-muted)]">
          {service.summary}
        </p>
        <div className="mt-auto grid gap-[var(--space-3)] pt-[var(--space-6)] sm:grid-cols-2">
          <Link
            href={aiHref}
            className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-4)] py-[var(--space-3)] text-center text-sm font-bold text-white transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            <Bot className="h-4 w-4" aria-hidden="true" />
            Tư vấn hạng mục
          </Link>
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-4)] py-[var(--space-3)] text-center text-sm font-bold text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Xem chi tiết <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
