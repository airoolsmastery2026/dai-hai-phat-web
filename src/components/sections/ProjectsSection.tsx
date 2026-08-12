import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/content/services";
import { getPublicRouteSlug } from "@/lib/routing";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="scroll-mt-16 bg-[var(--color-background)] py-[var(--space-10)] lg:py-[var(--space-section)]"
    >
      <Container>
        <div className="flex flex-col gap-[var(--space-4)] sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Công trình &amp; giải pháp
            </p>
            <h2 className="mt-[var(--space-2)] text-[length:var(--font-h2)] font-bold text-[var(--color-text)]">
              Xem mẫu trước khi chọn phương án
            </h2>
            <p className="mt-[var(--space-3)] text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
              Một số nhóm công việc tiêu biểu để anh/chị hình dung vật liệu và kiểu hoàn thiện.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex min-h-11 w-fit items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-3)] text-sm font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Xem thư viện
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-[var(--space-6)] grid grid-cols-2 gap-[var(--space-3)] lg:grid-cols-4">
          {SERVICES.slice(0, 4).map((service) => (
            <Link
              key={service.slug}
              href={`/services/${getPublicRouteSlug(service.slug)}`}
              className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition duration-[var(--duration-medium)] hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-strong)]">
                <Image
                  src={service.image}
                  alt={`Hình minh họa: ${service.title}`}
                  fill
                  sizes="(max-width: 1023px) 50vw, 25vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-[var(--space-3)] sm:p-[var(--space-4)]">
                <p className="line-clamp-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)] sm:text-xs">
                  {service.subtitle}
                </p>
                <h3 className="mt-[var(--space-1)] line-clamp-2 text-sm font-bold leading-5 text-[var(--color-text)] sm:text-base sm:leading-6">
                  {service.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
