import type { Metadata } from "next";
import Link from "next/link";

import { VerifiedGallery } from "@/components/gallery/VerifiedGallery";
import { JsonLd } from "@/components/seo/JsonLd";
import { AIConsultationCta } from "@/components/sections/AIConsultationCta";
import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";
import { listPublicResidentialGallery } from "@/lib/ai/public-gallery";

export const metadata: Metadata = {
  title: "Thư viện công trình đã xác minh",
  description:
    "Xem hình ảnh nội thất và cơ khí dân dụng của Đại Hải Phát theo hạng mục, vật liệu, phong cách và loại nhà ở.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Thư viện công trình đã xác minh | Đại Hải Phát",
    description:
      "Thư viện hình ảnh nội thất và cơ khí dân dụng có nguồn cùng metadata đã xác minh.",
    url: "/gallery",
    type: "website",
    images: [
      {
        url: "/images/gates/gate01.webp",
        alt: "Cổng hai cánh hoa văn CNC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thư viện công trình đã xác minh | Đại Hải Phát",
    description:
      "Tìm công trình theo hạng mục, vật liệu, phong cách và loại công trình.",
    images: ["/images/gates/gate01.webp"],
  },
};

export default function GalleryPage() {
  const initialGallery = listPublicResidentialGallery({ limit: 6 });
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Thư viện công trình đã xác minh Đại Hải Phát",
    description:
      "Hình ảnh nội thất và cơ khí dân dụng cho nhà ở có metadata và nguồn sử dụng đã xác minh.",
    url: `${COMPANY_CONFIG.websiteUrl}/gallery`,
    numberOfItems: initialGallery.total,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: initialGallery.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        image: `${COMPANY_CONFIG.websiteUrl}${item.thumbnail.url}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <JsonLd data={collectionSchema} />
      <section className="border-b border-[var(--color-border)] bg-[linear-gradient(125deg,var(--color-surface)_0%,var(--color-primary-soft)_78%,var(--color-metal-soft)_100%)] py-[var(--space-8)] text-[var(--color-text)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-metal-strong)]">
            Công trình đã xác minh
          </p>
          <h1 className="mt-[var(--space-3)] max-w-4xl text-[length:var(--font-h1)] font-extrabold leading-tight">
            Tìm mẫu phù hợp với nhu cầu thực tế
          </h1>
          <p className="mt-[var(--space-3)] max-w-3xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base sm:leading-7">
            {initialGallery.total} ảnh được phân loại theo hạng mục, vật liệu và phong cách để đối chiếu nhanh trước khi trao đổi với kỹ sư.
          </p>
        </Container>
      </section>

      <section className="py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
        <Container>
          <nav
            aria-label="Đường dẫn trang"
            className="mb-[var(--space-3)] text-sm text-[var(--color-text-subtle)]"
          >
            <Link href="/" className="font-semibold hover:text-[var(--color-primary)]">
              Trang chủ
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Công trình</span>
          </nav>
          <VerifiedGallery initialGallery={initialGallery} />
        </Container>
      </section>

      <AIConsultationCta
        eyebrow="Từ mẫu tham khảo đến công trình thực tế"
        title="Cần phương án phù hợp với nhà của anh/chị?"
        description="Gửi hạng mục, kích thước dự kiến và ảnh hiện trạng. Kỹ sư sẽ kiểm tra trước khi tư vấn phương án và khảo sát."
        secondaryHref="/services"
        secondaryLabel="Xem dịch vụ"
      />
    </main>
  );
}
