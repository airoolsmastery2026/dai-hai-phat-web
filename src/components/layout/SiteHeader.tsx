"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { NAV_ITEMS } from "@/content/navigation";
import { theme } from "@/lib/theme";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-4 md:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-lg font-mono text-xl font-bold text-white shadow-md"
            style={{ backgroundColor: theme.colors.primary }}
          >
            ĐHP
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-wider text-slate-900">ĐẠI HẢI PHÁT</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Industrial engineering & interiors</span>
          </div>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-[#FF5722]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex">
          <a href="#bao-gia" className="rounded-full bg-[#FF5722] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600">
            Get a quote
          </a>
        </div>

        <button className="rounded-lg p-2 text-slate-700 lg:hidden" aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href="#bao-gia" onClick={() => setMobileMenuOpen(false)} className="text-[#FF5722]">
              Get a quote
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
