import Link from "next/link";

import { COMPANY_CONFIG } from "@/content/company";
import { NAV_ITEMS } from "@/content/navigation";
import { PROJECTS } from "@/content/projects";
import { SERVICES } from "@/content/services";

const footerColumns = [
  { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Factory", href: "/gallery" }, { label: "Certificates", href: "/about" }] },
  { title: "Services", links: SERVICES.slice(0, 4).map((service) => ({ label: service.title, href: `/services/${service.slug}` })) },
  { title: "Projects", links: PROJECTS.slice(0, 4).map((project) => ({ label: project.title, href: `/projects/${project.slug}` })) },
  { title: "Contact", links: [{ label: COMPANY_CONFIG.email, href: `mailto:${COMPANY_CONFIG.email}` }, { label: COMPANY_CONFIG.phones[0].display, href: `tel:${COMPANY_CONFIG.phones[0].raw}` }] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-16 text-slate-400">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 md:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF5722]">Enterprise footer</p>
          <h3 className="mt-4 text-2xl font-semibold text-white">{COMPANY_CONFIG.name}</h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">Engineering-led manufacturing, installation, and interior delivery for ambitious commercial and industrial projects.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {COMPANY_CONFIG.phones.map((phone) => (
              <a key={phone.raw} href={`tel:${phone.raw}`} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-[#FF5722] hover:text-white">
                {phone.display}
              </a>
            ))}
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">{column.title}</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-[1440px] flex-col gap-3 border-t border-slate-800 px-4 pt-8 text-sm md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <p>© {new Date().getFullYear()} {COMPANY_CONFIG.name}. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
