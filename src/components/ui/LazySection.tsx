import dynamic from "next/dynamic";
import type { ComponentType } from "react";

interface LazySectionProps {
  component: ComponentType<Record<string, never>>;
  fallback?: React.ReactNode;
}

export function LazySection({ component: Component, fallback = null }: LazySectionProps) {
  return <Component />;
}
