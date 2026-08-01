"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { useMobileAIOfficeVisibility } from "@/hooks/useMobileAIOfficeVisibility";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const isMobileOfficeVisible = useMobileAIOfficeVisibility();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isMobileOfficeVisible) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`fixed bottom-[var(--space-4)] left-[var(--space-4)] z-40 flex h-12 w-12 items-center justify-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-[var(--shadow-md)] transition duration-[var(--duration-fast)] hover:bg-[var(--color-surface-dark)] hover:text-white lg:bottom-[var(--space-8)] ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      aria-label="Về đầu trang"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
