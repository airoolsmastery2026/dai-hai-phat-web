import type { Metadata } from "next";
import Link from "next/link";

import { VerifiedGallery } from "@/components/gallery/VerifiedGallery";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
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
  const initialGallery = listPublicResidentialGallery({ limit: 12 });
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Thư viện công trình đã xác minh Đại Hải Phát",
    description:
      "Hình ảnh nội thất và cơ khí dân dụng cho nhà ở có metadata và nguồn sử dụng đã xác minh.",
    url: "https://daihaiphat.vn/gallery",
    numberOfItems: initialGallery.total,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: initialGallery.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        image: `https://daihaiphat.vn${item.thumbnail.url}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <JsonLd data={collectionSchema} />
      <section className="bg-[var(--color-surface-dark)] py-[var(--space-section)] text-white lg:py-[var(--space-section-lg)]">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary-soft-text)]">
            Thư viện công trình đã xác minh
          </p>
          <h1 className="mt-[var(--space-inline)] max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
            Tìm công trình theo nhu cầu thực tế
          </h1>
          <p className="mt-[var(--space-stack)] max-w-3xl text-base leading-7 text-[var(--color-text-dark-muted)] sm:text-lg">
            {initialGallery.total} ảnh công trình nhà ở được phân loại theo hạng
            mục, vật liệu và phong cách. Mỗi ảnh đều có nguồn và quyền sử dụng đã
            xác minh.
          </p>
          <p className="mt-[var(--space-control)] max-w-3xl text-sm leading-6 text-[var(--color-text-dark-subtle)]">
            Dữ liệu xưởng, vật liệu tham chiếu và công trình ngoài phạm vi dân dụng
            vẫn được giữ trong Knowledge Base nhưng không xuất hiện trong thư viện
            khách hàng.
          </p>
        </Container>
      </section>

      <section className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]">
        <Container>
          <nav
            aria-label="Đường dẫn trang"
            className="mb-[var(--space-stack)] text-sm text-[var(--color-text-subtle)]"
          >
            <Link href="/" className="font-semibold hover:text-[var(--color-primary)]">
              Trang chủ
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Thư viện công trình</span>
          </nav>
          <VerifiedGallery initialGallery={initialGallery} />
        </Container>
      </section>
    </main>
  );
}
