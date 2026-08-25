import type { HTMLAttributes } from "react";

const BRAND_LABEL = "Đại Hải Phát — Văn phòng kỹ thuật số 24/7";

type BrandLogoProps = HTMLAttributes<HTMLDivElement> & {
  inverse?: boolean;
  compact?: boolean;
};

export function BrandLogo({
  inverse = false,
  compact = false,
  className = "",
  ...props
}: BrandLogoProps) {
  const wordmarkColor = inverse
    ? "text-[var(--color-text-inverse)]"
    : "text-[var(--color-text)]";
  const taglineColor = inverse
    ? "text-[var(--color-text-dark-muted)]"
    : "text-[var(--color-metal-strong)]";
  const markColor = inverse
    ? "text-[var(--color-text-inverse)]"
    : "text-[var(--color-primary)]";

  return (
    <div
      className={`inline-flex min-w-0 items-center gap-2.5 sm:gap-3 ${className}`}
      aria-label={BRAND_LABEL}
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className={`${compact ? "h-9 w-9" : "h-10 w-10 sm:h-11 sm:w-11"} shrink-0 ${markColor}`}
      >
        <path
          fill="currentColor"
          d="M7 15.5 15 11v17.5l12-7 12 7V9.5l8-4.5v42l-8 4.5V36.2l-12-7-12 7V53l-8-4.5v-33Z"
        />
        <path
          fill="var(--color-metal)"
          d="M18 9.3 24 6v13.4l-6 3.5V9.3ZM30 31.1l6 3.5v17.8l-6 3.3V31.1Z"
        />
        <path
          fill="currentColor"
          d="M33 15h9.2C51 15 57 20.8 57 29s-6 14-14.8 14H39v-7.5h3.2c4.2 0 6.8-2.4 6.8-6.5s-2.6-6.5-6.8-6.5H33V15Z"
        />
      </svg>

      <span className="h-8 w-px shrink-0 bg-[var(--color-metal)]/70" aria-hidden="true" />

      <span className="min-w-0 leading-none" aria-hidden="true">
        <span
          className={`block whitespace-nowrap font-black uppercase tracking-[0.015em] ${wordmarkColor} ${
            compact ? "text-sm" : "text-[15px] sm:text-[17px]"
          }`}
        >
          ĐẠI HẢI PHÁT
        </span>
        <span
          className={`mt-1 block whitespace-nowrap font-bold uppercase tracking-[0.13em] ${taglineColor} ${
            compact ? "text-[7px]" : "text-[7px] sm:text-[8px]"
          }`}
        >
          VĂN PHÒNG KỸ THUẬT SỐ 24/7
        </span>
      </span>
    </div>
  );
}
