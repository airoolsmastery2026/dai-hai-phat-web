import Link from "next/link";

import { COMPANY_CONFIG } from "@/content/company";

const quickLinks = [
  { label: "Dịch vụ", href: "/services" },
  { label: "Công trình", href: "/gallery" },
  { label: "Checklist", href: "/blog" },
  { label: "Liên hệ", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border-dark)] bg-[var(--color-surface-dark)] py-[var(--space-8)] text-[var(--color-text-dark-subtle)]">
      <div className="mx-auto grid max-w-[var(--container-max)] gap-[var(--space-6)] px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-[var(--space-container-lg)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-soft-text)]">
            Đại Hải Phát
          </p>
          <h2 className="mt-[var(--space-2)] text-lg font-bold text-white">
            Nội thất &amp; cơ khí dân dụng
          </h2>
          <p className="mt-[var(--space-2)] max-w-md text-sm leading-6 text-[var(--color-text-dark-subtle)]">
            Thiết kế và thi công theo hiện trạng nhà ở, có kỹ sư kiểm tra phương án trước báo giá.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Xem nhanh
          </h2>
          <ul className="mt-[var(--space-3)] grid grid-cols-2 gap-x-[var(--space-4)] gap-y-[var(--space-2)] text-sm lg:grid-cols-1">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors duration-[var(--duration-fast)] hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Liên hệ
          </h2>
          <ul className="mt-[var(--space-3)] space-y-[var(--space-2)] text-sm">
            <li>
              <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`} className="transition hover:text-white">
                {COMPANY_CONFIG.phones[0].display}
              </a>
            </li>
            <li>
              <a href={`mailto:${COMPANY_CONFIG.email}`} className="break-all transition hover:text-white">
                {COMPANY_CONFIG.email}
              </a>
            </li>
            <li>
              <a href={COMPANY_CONFIG.socials.zalo1} target="_blank" rel="noreferrer" className="transition hover:text-white">
                Zalo
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-[var(--space-6)] flex max-w-[var(--container-max)] flex-col gap-[var(--space-2)] border-t border-[var(--color-border-dark)] px-[var(--space-container)] pt-[var(--space-4)] text-xs sm:px-[var(--space-container-sm)] lg:flex-row lg:items-center lg:justify-between lg:px-[var(--space-container-lg)]">
        <p>© {new Date().getFullYear()} {COMPANY_CONFIG.name}.</p>
        <Link href="/privacy" className="w-fit transition hover:text-white">
          Quyền riêng tư
        </Link>
      </div>
    </footer>
  );
}
