import { COMPANY_CONFIG } from "@/content/company";
import type { ServiceItem } from "@/types/content";

export function ServiceSidebar({ service }: { service: ServiceItem }) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Thông tin dịch vụ</h3>
      <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
        <li><span className="font-semibold text-slate-900">Dịch vụ:</span> {service.title}</li>
        <li><span className="font-semibold text-slate-900">Hotline:</span> {COMPANY_CONFIG.primaryPhone}</li>
        <li><span className="font-semibold text-slate-900">Email:</span> {COMPANY_CONFIG.email}</li>
      </ul>
    </aside>
  );
}
