"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { FAQ_ITEMS } from "@/content/faq";

export function FaqSection() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-3xl">
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }} className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF5722]">
            Frequently asked questions
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }} className="mt-4 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            Practical answers for clients planning a new build or retrofit.
          </motion.h2>
        </div>

        <div className="mt-16 space-y-4">
          {FAQ_ITEMS.map((faq, index) => (
            <motion.div key={faq.question} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.06 }} className="border border-slate-200 bg-[#f8f7f3] px-6 py-5">
              <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
