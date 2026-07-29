import Link from "next/link";

export function ProjectBreadcrumb({ currentLabel }: { currentLabel: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <li>
          <Link href="/" className="font-medium text-slate-700 hover:text-[var(--color-primary)]">
            Trang chủ
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link href="/projects" className="font-medium text-slate-700 hover:text-[var(--color-primary)]">
            Dự án
          </Link>
        </li>
        <li>/</li>
        <li className="text-slate-500">{currentLabel}</li>
      </ol>
    </nav>
  );
}
