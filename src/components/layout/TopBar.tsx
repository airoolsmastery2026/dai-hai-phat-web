import { COMPANY_CONFIG } from "@/content/company";
import { theme } from "@/lib/theme";

export function TopBar() {
  return (
    <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-300 md:px-8">
      <div className="mx-auto flex flex-col items-center justify-between gap-2 md:flex-row">
        <div className="flex items-center gap-4">
          <span>📍 {COMPANY_CONFIG.address}</span>
        </div>
        <div className="flex items-center gap-6">
          <span>✉️ {COMPANY_CONFIG.email}</span>
          <a
            href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
            className="font-semibold transition-colors hover:underline"
            style={{ color: theme.colors.primary }}
          >
            📞 Hotline: {COMPANY_CONFIG.phones[0].display}
          </a>
        </div>
      </div>
    </div>
  );
}
