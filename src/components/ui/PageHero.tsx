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
  const cinematic = Boolean(imageSrc);

  return (
    <section
      className={
        cinematic
          ? "relative isolate overflow-hidden border-b border-[var(--color-border-dark)] bg-[var(--color-surface-dark)] text-white"
          : "relative overflow-hidden border-b border-[var(--color-border)] bg-[linear-gradient(125deg,var(--color-surface)_0%,var(--color-primary-soft)_72%,var(--color-metal-soft)_100%)] text-[var(--color-text)]"
      }
    >
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="-z-30 object-cover"
            style={{ objectPosition: imagePosition }}
          />
          <div
            className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(8,20,21,0.96)_0%,rgba(8,20,21,0.84)_42%,rgba(8,20,21,0.38)_72%,rgba(8,20,21,0.22)_100%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(195,160,104,0.20),transparent_34%)]"
            aria-hidden="true"
          />
          <div
            className="metallic-rule pointer-events-none absolute inset-x-0 bottom-0 h-px"
            aria-hidden="true"
          />
        </>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,color-mix(in_srgb,var(--color-metal)_16%,transparent),transparent_38%)]"
          aria-hidden="true"
        />
      )}

      <Container
        className={
          cinematic
            ? "relative flex min-h-[24rem] items-center py-[var(--space-10)] sm:min-h-[28rem] sm:py-[var(--space-12)] lg:min-h-[32rem]"
            : "relative py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]"
        }
      >
        <div className={cinematic ? "max-w-[46rem]" : "max-w-[var(--content-max)]"}>
          <p
            className={
              cinematic
                ? "text-xs font-bold uppercase tracking-[0.18em] text-[#e6c58e] sm:text-sm"
                : "text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-metal-strong)] sm:text-sm"
            }
          >
            {eyebrow}
          </p>
          <h1
            className={
              cinematic
                ? "mt-[var(--space-3)] text-[length:var(--font-display)] font-extrabold leading-[1.02] tracking-[-0.04em] text-white"
                : "mt-[var(--space-3)] text-[length:var(--font-h1)] font-extrabold leading-tight tracking-[-0.03em]"
            }
          >
            {title}
          </h1>
          <p
            className={
              cinematic
                ? "mt-[var(--space-4)] max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8"
                : "mt-[var(--space-3)] max-w-3xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base sm:leading-7"
            }
          >
            {description}
          </p>

          {highlights.length ? (
            <ul className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-2)]" aria-label="Điểm nổi bật">
              {highlights.map((item) => (
                <li
                  key={item}
                  className={
                    cinematic
                      ? "rounded-full border border-white/16 bg-black/18 px-[var(--space-3)] py-[var(--space-2)] text-xs font-semibold text-white/88 backdrop-blur-sm"
                      : "rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-3)] py-[var(--space-2)] text-xs font-semibold text-[var(--color-text-muted)]"
                  }
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          {actions ? (
            <div className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-3)]">
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
