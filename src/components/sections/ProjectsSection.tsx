import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/content/services";
import { getPublicRouteSlug } from "@/lib/routing";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="scroll-mt-16 bg-[var(--color-background)] py-[var(--space-section)] lg:py-[var(--space-section-lg)]"
    >
      <Container>
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Thư viện giải pháp
          </p>
          <h2 className="mt-[var(--space-3)] text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            Hình dung phương án trước khi khảo sát
          </h2>
          <p className="mt-[var(--space-4)] leading-7 text-[var(--color-text-muted)]">
            Hình ảnh được chọn từ thư viện công trình có nguồn và quyền sử dụng
            đã xác minh của Đại Hải Phát.
          </p>
        </div>

        <div className="mt-[var(--space-10)] grid gap-[var(--space-5)] sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${getPublicRouteSlug(service.slug)}`}
              className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition duration-[var(--duration-medium)] hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-strong)]">
                <Image
                  src={service.image}
                  alt={`Hình minh họa: ${service.title}`}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <span className="absolute left-[var(--space-3)] top-[var(--space-3)] rounded-[var(--radius-full)] bg-[var(--color-surface-dark)]/90 px-[var(--space-3)] py-[var(--space-1)] text-xs font-semibold text-white">
                  Ảnh đã xác minh
                </span>
              </div>
              <div className="p-[var(--space-5)]">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                  {service.subtitle}
                </p>
                <h3 className="mt-[var(--space-2)] text-lg font-bold text-[var(--color-text)]">
                  {service.title}
                </h3>
                <p className="mt-[var(--space-4)] text-sm font-semibold text-[var(--color-primary)]">
                  Xem giải pháp →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
