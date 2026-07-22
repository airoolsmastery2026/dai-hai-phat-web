import Link from "next/link";
import type { ReactNode } from "react";

interface ActionButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function ActionButton({ href, children, variant = "primary", className = "" }: ActionButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all";
  const variantClasses =
    variant === "primary"
      ? "bg-[#FF5722] text-white shadow-lg hover:bg-orange-600"
      : "border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20";

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses} ${className}`.trim()}>
      {children}
    </Link>
  );
}
