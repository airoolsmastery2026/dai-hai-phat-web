"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG, COMPANY_STATS } from "@/content/company";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#07111f] py-24 text-white md:py-32 lg:min-h-[92vh]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,87,34,0.24),_transparent_28%),linear-gradient(120deg,_rgba(7,17,31,0.98),_rgba(15,23,42,0.95))]" />
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <Container className="relative z-10">
        <div className="grid items-end gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-300 backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-[#FF5722]" /> {COMPANY_CONFIG.shortName} • Industrial Engineering
            </div>
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-8xl">
              Engineering precision for demanding industrial spaces.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              We deliver end-to-end manufacturing, installation, and engineering solutions for premium interiors, composite systems, and steel structures.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#bao-gia" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5722] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600">
                Request a consultation <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#about" className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                Explore capabilities
              </a>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {COMPANY_STATS.map((stat) => (
                <div key={stat.label} className="border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
              <Image src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80" alt={`Industrial manufacturing and installation ${COMPANY_CONFIG.shortName}`} width={1000} height={640} priority className="h-[500px] w-full object-cover" />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
