"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ_ITEMS } from "@/content/faq";

export function FaqSection() {
  return (
    <section className="bg-white py-24">
      <Container>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
          <SectionHeading
            eyebrow="Câu hỏi thường gặp"
            title="Những câu hỏi mà khách hàng quan tâm nhất"
            description="Thông tin rõ ràng giúp khách hàng dễ dàng hiểu và đưa ra quyết định hợp lý."
          />
        </motion.div>

        <div className="mt-16 space-y-4">
          {FAQ_ITEMS.map((faq, index) => (
            <motion.div key={faq.question} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.06 }} className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5">
              <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
