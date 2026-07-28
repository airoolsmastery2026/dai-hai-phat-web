"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

import { COMPANY_CONFIG } from "@/content/company";

const menus = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Dịch vụ",
    href: "/#services",
  },
  {
    title: "AI tư vấn",
    href: "/#ai-office",
  },
  {
    title: "Dự án",
    href: "/#projects",
  },
  {
    title: "Liên hệ",
    href: "/#contact",
  },
];

export function SiteNavigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-slate-950/95 backdrop-blur">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20">

        <Link
          href="/"
          className="flex flex-col"
        >
          <span className="text-lg font-black uppercase tracking-wide text-white sm:text-2xl">
            ĐẠI HẢI PHÁT
          </span>

          <span className="text-[9px] uppercase tracking-[0.24em] text-orange-400 sm:text-xs">
            AI Digital Engineering Office
          </span>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">

          {menus.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-semibold uppercase tracking-wider text-white transition hover:text-orange-400"
            >
              {item.title}
            </Link>
          ))}

        </nav>

        <div className="hidden items-center gap-4 lg:flex">

          <a
            href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
            className="rounded-xl border border-orange-500 px-6 py-3 font-bold text-orange-400 transition hover:bg-orange-500 hover:text-white"
          >
            {COMPANY_CONFIG.phones[0].display}
          </a>

          <Link
            href="/#contact"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            Báo giá
          </Link>

        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-white lg:hidden"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-4 pb-6 lg:hidden">
          <nav className="flex flex-col py-3" aria-label="Điều hướng di động">
            {menus.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-white/10 text-base font-semibold text-white"
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <a
            href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 font-bold text-white"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Gọi {COMPANY_CONFIG.phones[0].display}
          </a>
        </div>
      )}
    </header>
  );
}
