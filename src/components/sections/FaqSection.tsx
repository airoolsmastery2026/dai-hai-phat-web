import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ_ITEMS } from "@/content/faq";

export function FaqSection() {
  return (
    <section className="bg-[var(--color-background)] py-24">
      <Container>
        <div className="max-w-3xl">
          <SectionHeading eyebrow="Frequently asked questions" title="Practical answers for clients planning a new build or retrofit." align="left" />
        </div>

        <div className="mt-16 space-y-4">
          {FAQ_ITEMS.map((faq) => (
            <div key={faq.question}>
              <Card className="px-6 py-5" tone="muted">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{faq.answer}</p>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
