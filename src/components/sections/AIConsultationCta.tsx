import { Bot } from "lucide-react";

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
    ? `/ai-tu-van?service=${encodeURIComponent(servicePreset)}&ai=1`
    : "/ai-tu-van?ai=1";

  return (
    <section className="bg-[var(--color-surface-dark)] py-[var(--space-8)] text-white lg:py-[var(--space-10)]">
      <Container>
        <div className="flex flex-col items-start justify-between gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-4)] sm:p-[var(--space-5)] md:flex-row md:items-center lg:p-[var(--space-6)]">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary-soft-text)]">
              {eyebrow}
            </p>
            <h2 className="mt-[var(--space-2)] text-xl font-bold leading-tight sm:text-2xl">
              {title}
            </h2>
            <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-dark-muted)]">
              {description}
            </p>
          </div>
          <div className="flex w-full flex-shrink-0 flex-col gap-[var(--space-2)] sm:w-auto sm:flex-row">
            <Button href={aiHref} className="w-full sm:w-auto">
              <Bot className="h-4 w-4" aria-hidden="true" />
              Bắt đầu tư vấn
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
