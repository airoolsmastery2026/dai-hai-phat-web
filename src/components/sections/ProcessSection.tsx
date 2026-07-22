"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { PROCESS_STEPS } from "@/content/process";

export function ProcessSection() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF5722]">Workflow</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              A disciplined delivery process from concept through maintenance.
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }} className="text-lg leading-8 text-slate-700">
            Every project follows a structured sequence of planning, fabrication, quality control, installation, and long-term service support.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PROCESS_STEPS.map((step, index) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, delay: index * 0.06 }} className="border border-slate-200 bg-[#f8f7f3] p-7">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FF5722]">Stage {index + 1}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">0{index + 1}</div>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
