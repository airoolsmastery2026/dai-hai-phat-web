import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <li>
          <Link href="/" className="font-medium text-slate-700 transition hover:text-[#FF5722]">
            Trang chủ
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-slate-400" />
              {isLast || !item.href ? (
                <span className="text-slate-500">{item.label}</span>
              ) : (
                <Link href={item.href} className="font-medium text-slate-700 transition hover:text-[#FF5722]">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
