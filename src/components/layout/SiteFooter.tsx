import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { COMPANY_CONFIG } from "@/content/company";
import { NAV_ITEMS } from "@/lib/theme";

const quickLinks = NAV_ITEMS.filter((item) => item.href !== "/");

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border-dark)] bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-primary-contrast)]/25"
      />

      <div className="relative mx-auto grid max-w-[var(--container-max)] gap-[var(--space-8)] px-[var(--space-container)] py-[var(--space-8)] sm:px-[var(--space-container-sm)] sm:py-[var(--space-10)] lg:grid-cols-[1.35fr_0.7fr_0.85fr] lg:gap-[var(--space-10)] lg:px-[var(--space-container-lg)]">
        <div>
          <BrandLogo inverse />
          <h2 className="mt-[var(--space-4)] text-xl font-bold tracking-[-0.01em] text-[var(--color-text-inverse)] sm:text-2xl">
            Nội thất &amp; cơ khí dân dụng
          </h2>
          <p className="mt-[var(--space-3)] max-w-lg text-[15px] leading-7 text-[var(--color-text-dark-muted)]">
            Thiết kế và thi công theo hiện trạng nhà ở, có kênh tư vấn tiếp nhận
            nhu cầu 24/7 và kỹ sư kiểm tra phương án trước báo giá.
          </p>

          <div className="mt-[var(--space-4)] flex max-w-lg items-start gap-[var(--space-3)] rounded-[var(--radius-lg)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] px-[var(--space-4)] py-[var(--space-3)] text-sm leading-6 text-[var(--color-text-dark-muted)] backdrop-blur-lg">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary-contrast)]"
              aria-hidden="true"
            />
            <span>Văn phòng / xưởng: {COMPANY_CONFIG.address}</span>
          </div>
        </div>

        <nav aria-label="Liên kết nhanh">
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-inverse)]">
            Xem nhanh
          </h2>
          <ul className="mt-[var(--space-3)] grid grid-cols-2 gap-x-[var(--space-4)] gap-y-[var(--space-2)] text-[15px] lg:grid-cols-1">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-[var(--radius-sm)] text-[var(--color-text-dark-muted)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-text-inverse)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-inverse)]">
            Liên hệ
          </h2>
          <ul className="mt-[var(--space-3)] space-y-[var(--space-2)] text-[15px]">
            <li>
              <a
                href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
                className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] text-[var(--color-text-dark-muted)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-text-inverse)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {COMPANY_CONFIG.phones[0].display}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${COMPANY_CONFIG.email}`}
                className="break-all rounded-[var(--radius-sm)] text-[var(--color-text-dark-muted)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-text-inverse)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                {COMPANY_CONFIG.email}
              </a>
            </li>
            <li>
              <a
                href={COMPANY_CONFIG.socials.zalo1}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] text-[var(--color-text-dark-muted)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-text-inverse)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Zalo
              </a>
            </li>
            <li>
              <a
                href={COMPANY_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] text-[var(--color-text-dark-muted)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-text-inverse)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                Xem bản đồ
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] backdrop-blur-lg">
        <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-[var(--space-2)] px-[var(--space-container)] py-[var(--space-4)] text-xs text-[var(--color-text-dark-subtle)] sm:px-[var(--space-container-sm)] lg:flex-row lg:items-center lg:justify-between lg:px-[var(--space-container-lg)]">
          <p>
            © {new Date().getFullYear()} {COMPANY_CONFIG.name}.
          </p>
          <Link
            href="/privacy"
            className="w-fit rounded-[var(--radius-sm)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-text-inverse)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Quyền riêng tư
          </Link>
        </div>
      </div>
    </footer>
  );
}
