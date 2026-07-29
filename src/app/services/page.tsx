import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SERVICES } from "@/content/services";
import { ServiceCard } from "@/components/services/ServiceCard";

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
        description="Từ tiếp nhận nhu cầu, khảo sát và chọn vật liệu đến gia công, lắp đặt và nghiệm thu, mỗi dịch vụ đều được triển khai theo hiện trạng nhà phố, căn hộ hoặc biệt thự."
      />

      <section className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
