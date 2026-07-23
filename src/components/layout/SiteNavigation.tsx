"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { COMPANY_CONFIG } from "@/content/company";
import { NAV_ITEMS } from "@/content/navigation";

export function SiteNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
            ĐHP
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold uppercase tracking-[0.24em] text-slate-900">{COMPANY_CONFIG.shortName}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Mechanical Construction</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 transition hover:text-[#FF5722]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href="tel:0785505518" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#FF5722] hover:text-[#FF5722]">
            Gọi ngay
          </a>
          <a href="#contact" className="rounded-full bg-[#FF5722] px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
            Nhận báo giá
          </a>
        </div>

        <button onClick={() => setMobileOpen(true)} className="rounded-full border border-slate-300 p-2 lg:hidden" aria-label="Open navigation menu">
          <Menu className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] bg-slate-950/70 lg:hidden">
          <aside className="ml-auto flex h-full w-[88%] max-w-[360px] flex-col bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FF5722]">Menu</p>
                <p className="mt-1 text-sm text-slate-600">Đại Hải Phát</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="rounded-full bg-slate-100 p-2" aria-label="Close navigation menu">
                <X className="h-5 w-5 text-slate-700" />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto rounded-xl bg-slate-900 p-4 text-white">
              <p className="text-sm font-semibold text-orange-300">Cần hỗ trợ nhanh?</p>
              <p className="mt-2 text-sm text-slate-300">Liên hệ ngay để nhận tư vấn thi công.</p>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="mt-4 inline-flex rounded-full bg-[#FF5722] px-4 py-2 text-sm font-semibold text-white">
                Nhận báo giá
              </a>
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
