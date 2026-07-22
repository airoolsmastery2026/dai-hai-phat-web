"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICES } from "@/content/services";

export function ServicesSection() {
  return (
    <section id="services" className="bg-slate-50 py-24">
      <Container>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
          <SectionHeading
            eyebrow="Lĩnh vực dịch vụ"
            title="Giải pháp chuyên sâu cho từng hạng mục công trình"
            description="Mỗi dịch vụ được xây dựng theo cấu trúc kỹ thuật rõ ràng, sẵn sàng cho triển khai thực tế và mở rộng sau này."
          />
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {SERVICES.map((service, index) => {
            const IconComp = service.icon;
            return (
              <motion.article key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.08 }} className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-56 overflow-hidden">
                  <Image src={service.image} alt={service.title} width={800} height={224} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute left-6 top-6 rounded-2xl bg-white/90 p-3 text-[#FF5722] shadow-md backdrop-blur-md">
                    <IconComp className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex flex-grow flex-col p-8">
                  <h3 className="text-2xl font-semibold text-slate-900">{service.title}</h3>
                  <p className="mt-4 flex-grow text-base leading-8 text-slate-600">{service.desc}</p>
                  <a href="#bao-gia" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#FF5722]">
                    Đăng ký tư vấn <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
