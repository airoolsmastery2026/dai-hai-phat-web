"use client";

import { Building2, Handshake, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COMPANY_CONFIG } from "@/content/company";

const values = [
  { title: "Engineering reliability", desc: "Precision planning and delivery with measurable quality controls at every stage." },
  { title: "Technical advisory", desc: "Project teams support concept development, installation sequencing, and lifecycle performance." },
  { title: "Long-term durability", desc: "Material specifications and installation standards designed for lasting operational use." },
];

const capabilities = ["Detailed engineering and fabrication drawings", "CNC mechanical processing and steel structures", "Industrial interiors and composite systems", "Installation, maintenance, and upgrade support"];

export function AboutSection() {
  return (
    <section id="about" className="bg-[var(--color-surface-muted)] py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
            <SectionHeading eyebrow="About the enterprise" title="A production partner built for high-specification industrial environments." align="left" />
            <p className="mt-6 text-lg leading-8 text-[var(--color-text-muted)]">
              {COMPANY_CONFIG.name} combines engineering discipline, craftsmanship, and dependable delivery to support projects that demand precision, durability, and long-term performance.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)]">
              <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" /> Certified delivery and execution discipline
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="space-y-4">
            {values.map((value, index) => (
              <Card key={value.title} className="p-6" hoverable>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-[var(--color-surface-dark)] p-3 text-white">
                    {index === 0 ? <Handshake className="h-5 w-5" /> : index === 1 ? <Sparkles className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">{value.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">{value.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((item) => (
            <Card key={item} className="p-5 text-sm font-medium leading-7 text-[var(--color-text-muted)]" tone="muted">
              {item}
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
