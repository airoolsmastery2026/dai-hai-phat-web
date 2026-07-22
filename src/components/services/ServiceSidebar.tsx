import { Phone, Mail, Briefcase } from "lucide-react";

import { COMPANY_CONFIG } from "@/content/company";
import type { ServiceItem } from "@/types/content";

export function ServiceSidebar({ service }: { service: ServiceItem }) {
  return (
    <aside className="sticky top-24 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Thông tin dịch vụ</h3>
      <ul className="mt-6 space-y-4">
        <li className="flex items-start gap-3">
          <Briefcase className="h-5 w-5 flex-shrink-0 text-[#FF5722] mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-slate-900">Dịch vụ</p>
            <p className="text-slate-600 break-all">{service.title}</p>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <Phone className="h-5 w-5 flex-shrink-0 text-[#FF5722] mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-slate-900">Hotline</p>
            <p className="text-slate-600 break-all">{COMPANY_CONFIG.primaryPhone}</p>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <Mail className="h-5 w-5 flex-shrink-0 text-[#FF5722] mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-slate-900">Email</p>
            <p className="text-slate-600 break-all">{COMPANY_CONFIG.email}</p>
          </div>
        </li>
      </ul>
    </aside>
  );
}
