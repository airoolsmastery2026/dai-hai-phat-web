"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { TESTIMONIALS } from "@/content/testimonials";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-[#f5f5f2] py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF5722]">Client confidence</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              Built on delivery reliability, technical clarity, and long-term stability.
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }} className="text-lg leading-8 text-slate-700">
            Our clients value consistent performance, disciplined execution, and a clear point of accountability from concept to handover.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((point, index) => (
            <motion.div key={point.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.45, delay: index * 0.08 }} className="border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">{point.title}</h3>
              <p className="mt-4 text-base leading-8 text-slate-600">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
