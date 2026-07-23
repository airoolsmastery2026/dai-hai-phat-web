import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/content/testimonials";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-[var(--color-surface-muted)] py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <SectionHeading eyebrow="Client confidence" title="Built on delivery reliability, technical clarity, and long-term stability." align="left" />
          </div>
          <p className="text-lg leading-8 text-[var(--color-text-muted)]">
            Our clients value consistent performance, disciplined execution, and a clear point of accountability from concept to handover.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((point) => (
            <div key={point.title}>
              <Card className="p-8" hoverable>
                <h3 className="text-xl font-semibold text-[var(--color-text)]">{point.title}</h3>
                <p className="mt-4 text-base leading-8 text-[var(--color-text-muted)]">{point.description}</p>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
