import Link from "next/link";

import { COMPANY_CONFIG } from "@/content/company";
import { SERVICES } from "@/content/services";
import { getPublicRouteSlug } from "@/lib/routing";

const quickLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Dịch vụ", href: "/services" },
  { label: "Dự án", href: "/projects" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border-dark)] bg-[var(--color-surface-dark)] py-[var(--space-16)] text-[var(--color-text-dark-subtle)]">
      <div className="mx-auto grid max-w-[var(--container-max)] gap-[var(--space-10)] px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-[var(--space-container-lg)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-soft-text)]">
            Đại Hải Phát
          </p>
          <h2 className="mt-[var(--space-3)] text-2xl font-bold text-white">
            {COMPANY_CONFIG.name}
          </h2>
          <p className="mt-[var(--space-4)] max-w-md text-sm leading-7 text-[var(--color-text-dark-subtle)]">
            Thiết kế và thi công nội thất, cửa cổng, cầu thang, lan can, mái
            che cùng các hạng mục cơ khí dân dụng theo hiện trạng nhà ở.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
            Liên kết nhanh
          </h2>
          <ul className="mt-[var(--space-5)] space-y-[var(--space-3)] text-sm">
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
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
            Liên hệ
          </h2>
          <ul className="mt-[var(--space-5)] space-y-[var(--space-3)] text-sm">
            <li>
              <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`} className="transition hover:text-white">
                {COMPANY_CONFIG.phones[0].display}
              </a>
            </li>
            <li>
              <a href={`mailto:${COMPANY_CONFIG.email}`} className="transition hover:text-white">
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

      <div className="mx-auto mt-[var(--space-12)] flex max-w-[var(--container-max)] flex-col gap-[var(--space-3)] border-t border-[var(--color-border-dark)] px-[var(--space-container)] pt-[var(--space-8)] text-sm sm:px-[var(--space-container-sm)] lg:flex-row lg:items-center lg:justify-between lg:px-[var(--space-container-lg)]">
        <p>
          © {new Date().getFullYear()} {COMPANY_CONFIG.name}. Đã đăng ký bản
          quyền.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/privacy" className="transition hover:text-white">
            Quyền riêng tư
          </Link>
          {SERVICES.slice(0, 3).map((service) => (
            <Link
              key={service.slug}
              href={`/services/${getPublicRouteSlug(service.slug)}`}
              className="transition hover:text-white"
            >
              {service.title}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
