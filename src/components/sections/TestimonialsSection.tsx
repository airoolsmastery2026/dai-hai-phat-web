"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/content/testimonials";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-slate-50 py-24">
      <Container>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
          <SectionHeading
            eyebrow="Niềm tin khách hàng"
            title="Được xây dựng trên cam kết về chất lượng, tiến độ và sự ổn định"
            description="Các dự án của Đại Hải Phát đều được triển khai theo nền tảng kỹ thuật vững chắc và quy trình vận hành rõ ràng."
          />
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((point, index) => (
            <motion.div key={point.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.45, delay: index * 0.08 }} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">{point.title}</h3>
              <p className="mt-4 text-base leading-8 text-slate-600">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
