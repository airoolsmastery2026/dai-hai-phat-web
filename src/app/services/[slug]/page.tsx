import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TopBar } from "@/components/layout/TopBar";
import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { BackToTop } from "@/components/layout/BackToTop";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceOverview } from "@/components/services/ServiceOverview";
import { ServiceFeatures } from "@/components/services/ServiceFeatures";
import { ServiceBenefits } from "@/components/services/ServiceBenefits";
import { ServiceProcess } from "@/components/services/ServiceProcess";
import { ServiceGallery } from "@/components/services/ServiceGallery";
import { RelatedProjects } from "@/components/services/RelatedProjects";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ServiceSidebar } from "@/components/services/ServiceSidebar";
import { SERVICES } from "@/content/services";
import { COMPANY_CONFIG } from "@/content/company";
import { normalizeRouteSlug } from "@/lib/routing";

export async function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeRouteSlug(slug);
  const service = SERVICES.find((item) => item.slug === normalizedSlug);

  if (!service) {
    return {};
  }

  return {
    title: `${service.title} | ${COMPANY_CONFIG.name}`,
    description: service.seo?.description ?? service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalizedSlug = normalizeRouteSlug(slug);
  const service = SERVICES.find((item) => item.slug === normalizedSlug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <SiteNavigation />
      <main>
      <ServiceHero service={service} />

      <section className="py-20">
        <Container>
          <Breadcrumb items={[{ label: "Dịch vụ", href: "/services" }, { label: service.title }]} />
          <div className="grid gap-10 lg:grid-cols-[1.6fr_0.8fr]">
            <div className="space-y-16">
              <ServiceOverview service={service} />
              <ServiceFeatures features={service.features} />
              <ServiceBenefits benefits={service.benefits} />
              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Quy trình thực hiện</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">Cách chúng tôi làm việc để bảo đảm hiệu quả</h2>
                </div>
                <ServiceProcess steps={service.process} />
              </div>
              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Hình ảnh thực tế</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">Mô hình triển khai và kết quả</h2>
                </div>
                <ServiceGallery images={service.gallery} title={service.title} />
              </div>
              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Dự án liên quan</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">Các hoạt động tương tự đã triển khai</h2>
                </div>
                <RelatedProjects projects={service.relatedProjects} />
              </div>
              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Câu hỏi thường gặp</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">Những thắc mắc doanh nghiệp thường gặp</h2>
                </div>
                <ServiceFAQ items={service.faq} />
              </div>
            </div>

            <div className="lg:pl-4">
              <ServiceSidebar service={service} />
            </div>
          </div>
        </Container>
      </section>

      <ServiceCTA />
      </main>
      <SiteFooter />
      <FloatingCta />
      <BackToTop />
    </div>
  );
}
