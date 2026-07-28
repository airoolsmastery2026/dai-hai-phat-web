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
    <nav aria-label="Đường dẫn trang" className="mb-[var(--space-8)]">
      <ol className="flex flex-wrap items-center gap-[var(--space-2)] text-sm text-[var(--color-text-muted)]">
        <li>
          <Link href="/" className="font-medium text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-primary)]">
            Trang chủ
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-[var(--space-2)]">
              <ChevronRight className="h-4 w-4 text-[var(--color-text-subtle)]" aria-hidden="true" />
              {isLast || !item.href ? (
                <span aria-current="page" className="text-[var(--color-text-subtle)]">{item.label}</span>
              ) : (
                <Link href={item.href} className="font-medium text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-primary)]">
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
