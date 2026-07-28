import Link from "next/link";

import { COMPANY_CONFIG } from "@/content/company";
import { SERVICES } from "@/content/services";

const quickLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Dịch vụ", href: "/services" },
  { label: "Dự án", href: "/projects" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-16 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FF5722]">Đại Hải Phát</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{COMPANY_CONFIG.name}</h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
            Tư vấn, thiết kế, gia công và thi công cơ khí xây dựng, nội thất theo
            yêu cầu thực tế của từng công trình.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Liên kết nhanh</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Liên hệ</h4>
          <ul className="mt-5 space-y-3 text-sm">
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

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-slate-800 px-4 pt-8 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} {COMPANY_CONFIG.name}. Đã đăng ký bản quyền.</p>
        <div className="flex flex-wrap gap-4">
          {SERVICES.slice(0, 3).map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="transition hover:text-white">
              {service.title}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
