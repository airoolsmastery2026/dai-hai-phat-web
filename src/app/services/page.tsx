import type { Metadata } from "next";

import { ServiceCard } from "@/components/services/ServiceCard";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SERVICES } from "@/content/services";

export const metadata: Metadata = {
  title: "Dịch vụ",
  description:
    "Dịch vụ nội thất, cửa cổng, cầu thang, lan can, mái che và gia công cơ khí theo yêu cầu tại Đại Hải Phát.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <PageHero
        eyebrow="Dịch vụ cho nhà ở"
        title="Nội thất và cơ khí dân dụng theo từng hạng mục"
        description="Từ nội thất gỗ đến cửa cổng, cầu thang, lan can và mái che — mỗi hạng mục đều được làm rõ hiện trạng, vật liệu và phương án trước khi chốt báo giá."
        imageSrc="/images/interior/interior01.webp"
        imageAlt="Không gian nội thất hoàn thiện Đại Hải Phát"
        imagePosition="68% center"
        highlights={["Thiết kế theo hiện trạng", "Vật liệu rõ quy cách", "Kỹ sư kiểm tra trước báo giá"]}
      />

      <section className="py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
        <Container>
          <div className="grid gap-[var(--space-4)] md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
