import { COMPANY_CONFIG } from "@/content/company";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10 text-center text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4">
        <p>© {new Date().getFullYear()} {COMPANY_CONFIG.name}. Tất cả quyền được bảo lưu.</p>
        <p className="mt-2 text-slate-500">Hotline: {COMPANY_CONFIG.phones[0].display} - {COMPANY_CONFIG.phones[1].display} | Email: {COMPANY_CONFIG.email}</p>
      </div>
    </footer>
  );
}
