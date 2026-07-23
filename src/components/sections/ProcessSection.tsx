import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS_STEPS } from "@/content/process";

export function ProcessSection() {
  return (
    <section className="bg-[var(--color-background)] py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <SectionHeading eyebrow="Workflow" title="A disciplined delivery process from concept through maintenance." align="left" />
          </div>
          <p className="text-lg leading-8 text-[var(--color-text-muted)]">
            Every project follows a structured sequence of planning, fabrication, quality control, installation, and long-term service support.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PROCESS_STEPS.map((step, index) => (
            <div key={step.title}>
              <Card className="p-7" tone="muted" hoverable>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">Stage {index + 1}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-dark)] text-sm font-semibold text-white">0{index + 1}</div>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[var(--color-text)]">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{step.desc}</p>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
