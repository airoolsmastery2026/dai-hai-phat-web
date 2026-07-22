"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS_STEPS } from "@/content/process";

export function ProcessSection() {
  return (
    <section className="bg-white py-24">
      <Container>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
          <SectionHeading
            eyebrow="Quy trình làm việc"
            title="6 bước triển khai rõ ràng, kiểm soát chặt chẽ"
            description="Từ nhận yêu cầu đến bàn giao, mỗi giai đoạn đều có trách nhiệm và tiêu chuẩn vận hành nhất quán."
          />
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PROCESS_STEPS.map((step, index) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, delay: index * 0.06 }} className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FF5722]">Bước {index + 1}</span>
                <div className="h-10 w-10 rounded-full bg-slate-900 text-center text-sm font-semibold leading-10 text-white">0{index + 1}</div>
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
