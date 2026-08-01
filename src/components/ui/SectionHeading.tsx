interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div className={`mx-auto flex max-w-3xl flex-col gap-3 ${alignment} ${className}`.trim()}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--color-primary)]">{eyebrow}</span>
      <h2 className="text-[length:var(--font-h2)] font-semibold leading-tight text-[var(--color-text)]">{title}</h2>
      {description ? <p className="text-base leading-8 text-[var(--color-text-muted)]">{description}</p> : null}
      <div className="mt-2 h-1 w-16 rounded-full bg-[var(--color-primary)]" />
    </div>
  );
}
