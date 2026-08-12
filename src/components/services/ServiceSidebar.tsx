import { Briefcase, Mail, Phone } from "lucide-react";

import { COMPANY_CONFIG } from "@/content/company";
import type { ServiceItem } from "@/types/content";

export function ServiceSidebar({ service }: { service: ServiceItem }) {
  return (
    <aside className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-5)] shadow-[var(--shadow-sm)] lg:sticky lg:top-20">
      <h2 className="text-base font-bold text-[var(--color-text)]">
        Liên hệ nhanh
      </h2>
      <ul className="mt-[var(--space-4)] space-y-[var(--space-3)]">
        <li className="flex items-start gap-[var(--space-2)]">
          <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold text-[var(--color-text)]">Hạng mục</p>
            <p className="break-words leading-5 text-[var(--color-text-muted)]">{service.title}</p>
          </div>
        </li>

        <li className="flex items-start gap-[var(--space-2)]">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold text-[var(--color-text)]">Hotline</p>
            <a
              href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
              className="break-all leading-5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
            >
              {COMPANY_CONFIG.primaryPhone}
            </a>
          </div>
        </li>

        <li className="flex items-start gap-[var(--space-2)]">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold text-[var(--color-text)]">Email</p>
            <a
              href={`mailto:${COMPANY_CONFIG.email}`}
              className="break-all leading-5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
            >
              {COMPANY_CONFIG.email}
            </a>
          </div>
        </li>
      </ul>
    </aside>
  );
}
