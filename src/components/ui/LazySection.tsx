import type { ComponentType } from "react";

interface LazySectionProps {
  component: ComponentType<Record<string, never>>;
}

export function LazySection({ component: Component }: LazySectionProps) {
  return <Component />;
}
