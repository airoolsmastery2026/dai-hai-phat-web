import type { Metadata } from "next";
import Image from "next/image";

import { TopBar } from "@/components/layout/TopBar";
import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { BackToTop } from "@/components/layout/BackToTop";
import { Container } from "@/components/ui/Container";
import { FactoryOverview } from "@/components/factory/FactoryOverview";
import { ProductionCapacity } from "@/components/factory/ProductionCapacity";
import { Machinery } from "@/components/factory/Machinery";
import { FactoryWorkflow } from "@/components/factory/FactoryWorkflow";
import { QualityControl } from "@/components/factory/QualityControl";
import { Certificates } from "@/components/factory/Certificates";
import { FactoryTimeline } from "@/components/factory/FactoryTimeline";
import { FactoryStatistics } from "@/components/factory/FactoryStatistics";
import { FactoryVideo } from "@/components/factory/FactoryVideo";
import { COMPANY_CONFIG } from "@/content/company";
import {
  FACTORY_OVERVIEW,
  PRODUCTION_CAPACITY,
  MACHINERY,
  WORKFLOW,
  QUALITY_CONTROL,
  CERTIFICATES,
  FACTORY_TIMELINE,
  STATISTICS,
} from "@/content/factory";
import { PROJECTS } from "@/content/projects";
import { SERVICES } from "@/content/services";

export const metadata: Metadata = {
  title: "Nhà máy Đại Hải Phát",
  description: "Khám phá nhà máy 5,000 m² với công nghệ CNC, hàn robot và quy trình kiểm chất lượng 360 độ theo tiêu chuẩn ISO 9001:2015.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Nhà máy Đại Hải Phát",
    description: "Khám phá nhà máy 5,000 m² với công nghệ CNC, hàn robot và quy trình kiểm chất lượng 360 độ.",
    url: `${COMPANY_CONFIG.websiteUrl}/gallery`,
    type: "website",
  },
};

export default function GalleryPage() {
  const galleryImages = [...PROJECTS.flatMap((project) => project.gallery), ...SERVICES.flatMap((service) => service.gallery)];

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <SiteNavigation />
      <main>
        <section className="bg-slate-950 py-24 text-white">
          <Container>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Factory Tour</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">Nhà máy Đại Hải Phát</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Diện tích 5,000 m² trang bị công nghệ gia công CNC, hàn robot và hệ thống kiểm chất lượng tự động đạt chuẩn ISO 9001:2015.
            </p>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="space-y-20">
              <FactoryOverview data={FACTORY_OVERVIEW} />

              <ProductionCapacity data={PRODUCTION_CAPACITY} />

              <FactoryStatistics data={STATISTICS} />

              <Machinery data={MACHINERY} />

              <FactoryWorkflow data={WORKFLOW} />

              <QualityControl data={QUALITY_CONTROL} />

              <Certificates data={CERTIFICATES} />

              <FactoryTimeline data={FACTORY_TIMELINE} />

              <FactoryVideo />

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Gallery</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-900">Thư viện hình ảnh</h2>
                <p className="mt-3 max-w-2xl text-base text-slate-600">Hình ảnh thực tế từ các dự án hoàn thành của Đại Hải Phát.</p>

                <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {galleryImages.slice(0, 12).map((image, index) => (
                    <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="relative h-64">
                        <Image src={image} alt={`Gallery image ${index + 1}`} fill className="object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
      <FloatingCta />
      <BackToTop />
    </div>
  );
}
