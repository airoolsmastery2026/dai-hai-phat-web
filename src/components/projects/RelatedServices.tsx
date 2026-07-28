import Link from "next/link";

import { SERVICES } from "@/content/services";

export function RelatedServices() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {SERVICES.slice(0, 2).map((service) => (
        <Link key={service.slug} href={`/services/${service.slug}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">Dịch vụ liên quan</p>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">{service.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{service.summary}</p>
        </Link>
      ))}
    </div>
  );
}
