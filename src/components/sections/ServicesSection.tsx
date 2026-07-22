"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/content/services";

export function ServicesSection() {
  return (
    <section id="services" className="bg-white py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF5722]">Core capabilities</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              Integrated engineering and production capabilities for complex delivery environments.
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }} className="text-lg leading-8 text-slate-700">
            Each service line is executed with disciplined planning, clear technical ownership, and production-grade delivery standards.
          </motion.p>
        </div>

        <div className="mt-16 space-y-6">
          {SERVICES.map((service, index) => {
            const IconComp = service.icon;
            return (
              <motion.article key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.06 }} className="group grid gap-8 border border-slate-200 bg-[#f8f7f3] p-8 lg:grid-cols-[0.45fr_0.55fr] lg:p-10">
                <div className="relative min-h-[260px] overflow-hidden">
                  <Image src={service.image} alt={service.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/90 p-3 text-[#FF5722] shadow-sm">
                    <IconComp className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF5722]">{service.subtitle}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-900">{service.title}</h3>
                  <p className="mt-4 text-base leading-8 text-slate-700">{service.summary}</p>
                  <a href="#bao-gia" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-[#FF5722]">
                    Request consultation <ArrowRight className="h-4 w-4" />
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
