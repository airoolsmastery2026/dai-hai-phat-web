import { ArrowUpRight, Bot } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

interface AIConsultationCtaProps {
  eyebrow: string;
  title: string;
  description: string;
  secondaryHref: string;
  secondaryLabel: string;
  servicePreset?: string;
}

export function AIConsultationCta({
  eyebrow,
  title,
  description,
  secondaryHref,
  secondaryLabel,
  servicePreset,
}: AIConsultationCtaProps) {
  const aiHref = servicePreset
    ? `/ai-tu-van?service=${encodeURIComponent(servicePreset)}&ai=1#consultation`
    : "/ai-tu-van?ai=1#consultation";

  return (
    <section className="border-y border-[var(--color-border-dark)] bg-[var(--color-surface-dark)]/95 py-[var(--space-8)] text-[var(--color-text-inverse)] backdrop-blur-md lg:py-[var(--space-10)]">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)]/80 p-[var(--space-5)] shadow-[var(--shadow-lg)] backdrop-blur-xl sm:p-[var(--space-6)] md:flex md:items-center md:justify-between md:gap-[var(--space-8)] lg:p-[var(--space-8)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-primary-contrast)]/30"
          />

          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-dark-muted)]">
              {eyebrow}
            </p>
            <h2 className="mt-[var(--space-2)] text-xl font-bold leading-tight text-[var(--color-text-inverse)] sm:text-2xl">
              {title}
            </h2>
            <p className="mt-[var(--space-3)] max-w-xl text-[15px] leading-7 text-[var(--color-text-dark-muted)]">
              {description}
            </p>
          </div>

          <div className="relative mt-[var(--space-5)] flex w-full flex-shrink-0 flex-col gap-[var(--space-2)] sm:w-auto sm:flex-row md:mt-0">
            <Button href={aiHref} className="w-full sm:w-auto">
              <Bot className="h-4 w-4" aria-hidden="true" />
              Bắt đầu tư vấn
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              href={secondaryHref}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
