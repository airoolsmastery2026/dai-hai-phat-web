"use client";

import { motion } from "framer-motion";

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
          {FAQ_ITEMS.map((faq, index) => (
            <motion.div key={faq.question} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.06 }}>
              <Card className="px-6 py-5" tone="muted">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{faq.answer}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
