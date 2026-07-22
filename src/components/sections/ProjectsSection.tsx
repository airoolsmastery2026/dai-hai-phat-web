"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FEATURED_PROJECTS } from "@/content/projects";

export function ProjectsSection() {
  return (
    <section className="bg-[var(--color-surface-muted)] py-24">
      <Container>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
            <SectionHeading eyebrow="Featured projects" title="Selected work delivered to demanding industrial and commercial clients." align="left" />
          </motion.div>
          <motion.a initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }} href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] transition hover:text-[var(--color-primary)]">
            View full portfolio <ArrowUpRight className="h-4 w-4" />
          </motion.a>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {FEATURED_PROJECTS.map((project, index) => (
            <motion.article key={project.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <Card className="group overflow-hidden" hoverable>
                <div className="relative h-72 overflow-hidden">
                  <Image src={project.image} alt={project.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-700">
                    {project.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-[var(--color-text)]">{project.title}</h3>
                    <ArrowUpRight className="h-5 w-5 text-[var(--color-primary)]" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{project.summary}</p>
                </div>
              </Card>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
