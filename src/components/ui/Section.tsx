import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className = "" }: SectionProps) {
  return <section className={`scroll-mt-24 ${className}`.trim()}>{children}</section>;
}
