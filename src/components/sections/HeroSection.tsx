"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { COMPANY_CONFIG, COMPANY_STATS } from "@/content/company";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 text-white md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,87,34,0.3),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.98))]" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <Container className="relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-orange-300 backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-[#FF5722]" /> Gỗ MDF Melamine – Composite – Kết Cấu Thép
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              Giải pháp sản xuất và thi công cho các doanh nghiệp hiện đại.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {COMPANY_CONFIG.name} chuyên thi công nội thất công nghiệp, vật liệu composite và kết cấu thép với quy trình kiểm soát chất lượng nghiêm ngặt.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="#bao-gia">Yêu cầu báo giá</Button>
              <Button href="#about" variant="secondary">Tìm hiểu thêm</Button>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {COMPANY_STATS.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-lg">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"
                alt={`Nội thất và cơ khí ${COMPANY_CONFIG.shortName}`}
                width={1000}
                height={480}
                priority
                className="h-[480px] w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
