"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FEATURED_PROJECTS } from "@/content/projects";


export function ProjectsSection() {
  return (
    <section className="bg-slate-50 py-24">
      <Container>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
          <SectionHeading
            eyebrow="Dự án nổi bật"
            title="Các công trình được thiết kế và thi công theo tiêu chuẩn công nghiệp"
            description="Mỗi dự án là một minh chứng cho sự kết hợp giữa kỹ thuật, thẩm mỹ và độ bền vững."
          />
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {FEATURED_PROJECTS.map((project, index) => (
            <motion.article key={project.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.08 }} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-72 overflow-hidden">
                <Image src={project.image} alt={project.title} width={900} height={288} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                  {project.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">{project.title}</h3>
                  <ArrowUpRight className="h-5 w-5 text-[#FF5722]" />
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{project.summary}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
