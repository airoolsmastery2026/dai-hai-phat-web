"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { COMPANY_CONFIG } from "@/content/company";
import { NAV_ITEMS } from "@/content/navigation";
import { SERVICES } from "@/content/services";
import { PROJECTS } from "@/content/projects";

const megaMenuSections = [
  {
    title: "Services",
    items: SERVICES.slice(0, 4).map((service) => ({ label: service.title, href: `/services/${service.slug}` })),
  },
  {
    title: "Projects",
    items: PROJECTS.slice(0, 4).map((project) => ({ label: project.title, href: `/projects/${project.slug}` })),
  },
  {
    title: "About",
    items: [
      { label: "Company profile", href: "/about" },
      { label: "Factory overview", href: "/gallery" },
      { label: "Certificates", href: "/about" },
    ],
  },
];

export function SiteNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur" : "bg-transparent"}`}>
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-4 md:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl font-mono text-lg font-bold text-white ${scrolled ? "bg-[#FF5722]" : "bg-slate-900/80"}`}>
            ĐHP
          </div>
          <div className="flex flex-col">
            <span className={`text-[13px] font-semibold uppercase tracking-[0.3em] ${scrolled ? "text-slate-900" : "text-white"}`}>{COMPANY_CONFIG.shortName}</span>
            <span className={`text-[10px] uppercase tracking-[0.25em] ${scrolled ? "text-slate-500" : "text-slate-300"}`}>Engineering & Interiors</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isMega = item.label === "Dịch vụ" || item.label === "Dự án" || item.label === "Giới thiệu";
            return (
              <div key={item.href} className="relative" onMouseEnter={() => isMega && setActiveMega(item.label)} onMouseLeave={() => isMega && setActiveMega(null)}>
                <Link href={item.href} className={`flex items-center gap-1 text-sm font-semibold transition ${scrolled ? "text-slate-700 hover:text-[#FF5722]" : "text-white/90 hover:text-white"}`}>
                  {item.label}
                  {isMega ? <ChevronDown className="h-4 w-4" /> : null}
                </Link>
                {isMega ? (
                  <AnimatePresence>
                    {activeMega === item.label ? (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute left-0 top-full mt-4 w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                        <div className="mb-4 border-b border-slate-200 pb-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#FF5722]">{item.label}</p>
                        </div>
                        <div className="space-y-2">
                          {megaMenuSections.find((section) => section.title === (item.label === "Giới thiệu" ? "About" : item.label === "Dịch vụ" ? "Services" : "Projects"))?.items.map((entry) => (
                            <Link key={entry.href} href={entry.href} className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-[#FF5722]">
                              {entry.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:flex">
          <Link href="#bao-gia" className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${scrolled ? "bg-[#FF5722] text-white hover:bg-orange-600" : "border border-white/20 bg-white/10 text-white hover:bg-white/20"}`}>
            Get a quote
          </Link>
        </div>

        <button onClick={() => setMobileOpen(true)} className={`rounded-full p-2 lg:hidden ${scrolled ? "bg-slate-100 text-slate-900" : "bg-white/10 text-white"}`} aria-label="Open navigation menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-slate-950/70 lg:hidden">
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 28 }} className="ml-auto flex h-full w-[88%] max-w-[360px] flex-col bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF5722]">Navigation</p>
                  <p className="mt-1 text-sm text-slate-600">Enterprise access</p>
                </div>
                <button onClick={() => setMobileOpen(false)} className="rounded-full bg-slate-100 p-2 text-slate-700" aria-label="Close navigation menu">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {NAV_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800">
                    <span>{item.label}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </Link>
                ))}
              </div>

              <div className="mt-auto rounded-2xl bg-slate-900 p-5 text-white">
                <p className="text-sm font-semibold text-orange-300">Need a rapid response?</p>
                <p className="mt-2 text-sm text-slate-300">Call our engineering team or request a tailored quote.</p>
                <Link href="#bao-gia" onClick={() => setMobileOpen(false)} className="mt-4 inline-flex rounded-full bg-[#FF5722] px-4 py-2 text-sm font-semibold text-white">
                  Request a quote
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
