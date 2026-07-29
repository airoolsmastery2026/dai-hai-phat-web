import { Phone, Mail, Briefcase } from "lucide-react";

import { COMPANY_CONFIG } from "@/content/company";
import type { ServiceItem } from "@/types/content";

export function ServiceSidebar({ service }: { service: ServiceItem }) {
  return (
    <aside className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-8)] shadow-[var(--shadow-sm)] lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-[var(--color-text)]">
        Thông tin dịch vụ
      </h2>
      <ul className="mt-[var(--space-6)] space-y-[var(--space-4)]">
        <li className="flex items-start gap-[var(--space-3)]">
          <Briefcase className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold text-[var(--color-text)]">Dịch vụ</p>
            <p className="break-words text-[var(--color-text-muted)]">{service.title}</p>
          </div>
        </li>

        <li className="flex items-start gap-[var(--space-3)]">
          <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold text-[var(--color-text)]">Hotline</p>
            <a
              href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
              className="break-all text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
            >
              {COMPANY_CONFIG.primaryPhone}
            </a>
          </div>
        </li>

        <li className="flex items-start gap-[var(--space-3)]">
          <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold text-[var(--color-text)]">Email</p>
            <a
              href={`mailto:${COMPANY_CONFIG.email}`}
              className="break-all text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
            >
              {COMPANY_CONFIG.email}
            </a>
          </div>
        </li>
      </ul>
    </aside>
  );
}
