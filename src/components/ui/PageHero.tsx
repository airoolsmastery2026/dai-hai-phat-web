import Image from "next/image";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: string;
  highlights?: readonly string[];
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  imageSrc,
  imageAlt = "",
  imagePosition = "center",
  highlights = [],
}: PageHeroProps) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <Container className="py-[var(--space-6)] sm:py-[var(--space-8)] lg:py-[var(--space-10)]">
        <div
          className={
            imageSrc
              ? "grid items-center gap-[var(--space-5)] lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-[var(--space-8)]"
              : "max-w-[var(--content-max)]"
          }
        >
          <div className="max-w-[46rem]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-metal-strong)] sm:text-sm">
              {eyebrow}
            </p>
            <h1 className="mt-[var(--space-2)] text-[length:var(--font-h1)] font-extrabold leading-tight tracking-[-0.03em] text-[var(--color-text)]">
              {title}
            </h1>
            <p className="mt-[var(--space-3)] max-w-3xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base sm:leading-7">
              {description}
            </p>

            {highlights.length ? (
              <ul className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]" aria-label="Điểm nổi bật">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-3)] py-[var(--space-2)] text-xs font-semibold text-[var(--color-text-muted)] shadow-[var(--shadow-sm)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {actions ? (
              <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-3)]">
                {actions}
              </div>
            ) : null}
          </div>

          {imageSrc ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] shadow-[var(--shadow-sm)] lg:aspect-[4/3]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 1023px) 100vw, 320px"
                className="object-cover"
                style={{ objectPosition: imagePosition }}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(8,20,21,0.22)_100%)]"
                aria-hidden="true"
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
