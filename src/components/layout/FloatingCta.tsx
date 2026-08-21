"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

import { COMPANY_CONFIG } from "@/content/company";

export function FloatingCta() {
  const pathname = usePathname();
  const hideOnMobileConsultation = pathname === "/ai-tu-van";

  return (
    <a
      href={COMPANY_CONFIG.socials.zalo1}
      target="_blank"
      rel="noreferrer"
      className={`${hideOnMobileConsultation ? "hidden sm:inline-flex" : "inline-flex"} fixed bottom-[max(var(--space-4),env(safe-area-inset-bottom))] right-[max(var(--space-4),env(safe-area-inset-right))] z-50 min-h-12 items-center gap-2 rounded-full bg-[var(--color-channel-zalo)] px-4 text-sm font-black text-white shadow-[var(--shadow-lg)] transition-transform duration-[var(--duration-fast)] hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 sm:right-[var(--space-6)] lg:bottom-[var(--space-8)] lg:right-[var(--space-8)]`}
      aria-label="Liên hệ Đại Hải Phát qua Zalo"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span>Zalo</span>
    </a>
  );
}
