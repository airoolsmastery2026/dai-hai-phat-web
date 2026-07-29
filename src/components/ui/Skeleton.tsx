interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <span
      className={`block animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-strong)] ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
