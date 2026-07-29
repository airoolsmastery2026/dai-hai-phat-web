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
    ? `/?service=${encodeURIComponent(servicePreset)}#ai-office`
    : "/#ai-office";

  return (
    <section className="bg-[var(--color-surface-dark)] py-[var(--space-section)] text-white lg:py-[var(--space-section-lg)]">
      <Container>
        <div className="flex flex-col items-start justify-between gap-[var(--space-8)] rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-8)] md:flex-row md:items-center md:p-[var(--space-12)]">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary-soft-text)]">
              {eyebrow}
            </p>
            <h2 className="mt-[var(--space-4)] text-3xl font-bold leading-tight md:text-4xl">
              {title}
            </h2>
            <p className="mt-[var(--space-3)] text-base leading-7 text-[var(--color-text-dark-muted)] md:text-lg">
              {description}
            </p>
          </div>
          <div className="flex w-full flex-shrink-0 flex-col gap-[var(--space-3)] sm:w-auto sm:flex-row">
            <Button href={aiHref} className="w-full sm:w-auto">
              <Bot className="h-4 w-4" aria-hidden="true" />
              Lập hồ sơ với AI
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
