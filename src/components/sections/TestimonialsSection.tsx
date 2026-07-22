"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/content/testimonials";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-[var(--color-surface-muted)] py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
            <SectionHeading eyebrow="Client confidence" title="Built on delivery reliability, technical clarity, and long-term stability." align="left" />
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }} className="text-lg leading-8 text-[var(--color-text-muted)]">
            Our clients value consistent performance, disciplined execution, and a clear point of accountability from concept to handover.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((point, index) => (
            <motion.div key={point.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <Card className="p-8" hoverable>
                <h3 className="text-xl font-semibold text-[var(--color-text)]">{point.title}</h3>
                <p className="mt-4 text-base leading-8 text-[var(--color-text-muted)]">{point.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
