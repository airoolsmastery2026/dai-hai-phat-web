"use client";

import Link from "next/link";
import { Bot, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

import { COMPANY_CONFIG } from "@/content/company";
import { NAV_ITEMS } from "@/lib/theme";

export function SiteNavigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = open ? "hidden" : "";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border-dark)] bg-[var(--color-surface-dark)]/95 text-[var(--color-text-inverse)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:h-20 lg:px-[var(--space-container-lg)]">
        <Link
          href="/"
          className="flex flex-col rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          aria-label="Đại Hải Phát — Trang chủ"
        >
          <span className="text-lg font-black uppercase tracking-wide text-white sm:text-2xl">
            ĐẠI HẢI PHÁT
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-primary-soft-text)] sm:text-xs">
            AI Digital Engineering Office
          </span>
        </Link>

        <nav
          className="hidden items-center gap-[var(--space-8)] lg:flex"
          aria-label="Điều hướng chính"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-sm)] text-sm font-semibold text-[var(--color-text-dark-muted)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-text-inverse)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-[var(--space-3)] lg:flex">
          <a
            href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
            className="inline-flex min-h-[var(--control-min-size)] items-center rounded-[var(--radius-md)] border border-[var(--color-primary)] px-[var(--space-5)] py-[var(--space-3)] text-sm font-bold text-[var(--color-primary-soft-text)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary)] hover:text-white"
          >
            {COMPANY_CONFIG.phones[0].display}
          </a>
          <Link
            href="/#ai-office"
            className="inline-flex min-h-[var(--control-min-size)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-5)] py-[var(--space-3)] text-sm font-bold text-white transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)]"
          >
            <Bot className="h-4 w-4" aria-hidden="true" />
            Tư vấn AI 24/7
          </Link>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-dark)] text-white lg:hidden"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-[var(--color-border-dark)] bg-[var(--color-surface-dark)] px-[var(--space-container)] pb-[var(--space-6)] lg:hidden"
        >
          <nav
            className="flex flex-col py-[var(--space-3)]"
            aria-label="Điều hướng di động"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-[var(--color-border-dark)] text-base font-semibold text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-[var(--space-3)]">
            <Link
              href="/#ai-office"
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] font-bold text-white"
            >
              <Bot className="h-5 w-5" aria-hidden="true" />
              Bắt đầu tư vấn AI
            </Link>
            <a
              href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
              className="flex min-h-12 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--color-border-dark)] font-bold text-white"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Gọi {COMPANY_CONFIG.phones[0].display}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
