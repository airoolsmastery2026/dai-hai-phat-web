"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { FEATURED_PROJECTS } from "@/content/projects";

export function ProjectsSection() {
  return (
    <section className="bg-[#f5f5f2] py-24">
      <Container>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF5722]">Featured projects</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              Selected work delivered to demanding industrial and commercial clients.
            </h2>
          </motion.div>
          <motion.a initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }} href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-[#FF5722]">
            View full portfolio <ArrowUpRight className="h-4 w-4" />
          </motion.a>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {FEATURED_PROJECTS.map((project, index) => (
            <motion.article key={project.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.08 }} className="group overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="relative h-72 overflow-hidden">
                <Image src={project.image} alt={project.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-700">
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
