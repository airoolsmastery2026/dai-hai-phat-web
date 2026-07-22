"use client";

import { Building2, Handshake, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COMPANY_CONFIG } from "@/content/company";

const values = [
  { title: "Độ tin cậy", desc: "Thi công đúng tiến độ, đúng chất lượng và đúng cam kết với khách hàng." },
  { title: "Tư vấn kỹ thuật", desc: "Đội ngũ chuyên gia hỗ trợ từ khảo sát, thiết kế, thi công đến vận hành." },
  { title: "Bền vững", desc: "Vật tư và quy trình được lựa chọn để tối ưu hiệu quả lâu dài." },
];

const capabilities = ["Thiết kế và bản vẽ chi tiết", "Gia công cơ khí CNC và kết cấu thép", "Thi công nội thất công nghiệp và composite", "Hỗ trợ bảo trì và nâng cấp"];

export function AboutSection() {
  return (
    <section id="about" className="bg-white py-24">
      <Container>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
          <SectionHeading
            eyebrow="Về Đại Hải Phát"
            title="Đối tác sản xuất và thi công cho không gian công nghiệp hiện đại"
            description="Từ thiết kế đến vận hành, chúng tôi mang đến giải pháp nội thất, vật liệu composite và kết cấu cơ khí với độ chính xác và thẩm mỹ cao."
          />
        </motion.div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="mb-6 inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-[#FF5722]">
              <ShieldCheck className="mr-2 h-4 w-4" /> Công ty sản xuất và thi công
            </div>
            <h3 className="text-2xl font-semibold text-slate-900">Tổng thể năng lực của doanh nghiệp</h3>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {COMPANY_CONFIG.name} cung cấp giải pháp trọn gói cho các hạng mục nội thất công nghiệp, vật liệu composite và kết cấu thép với quy trình kiểm soát chất lượng nghiêm ngặt.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {capabilities.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="space-y-4">
            {values.map((value, index) => (
              <div key={value.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-slate-900 p-3 text-white">
                    {index === 0 ? <Handshake className="h-5 w-5" /> : index === 1 ? <Sparkles className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{value.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{value.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
