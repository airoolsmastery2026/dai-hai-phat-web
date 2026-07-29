import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceBenefits } from "@/components/services/ServiceBenefits";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceFeatures } from "@/components/services/ServiceFeatures";
import { ServiceGallery } from "@/components/services/ServiceGallery";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceOverview } from "@/components/services/ServiceOverview";
import { ServiceProcess } from "@/components/services/ServiceProcess";
import { ServiceSidebar } from "@/components/services/ServiceSidebar";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";
import { SERVICES } from "@/content/services";
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

  const title = service.seo.title ?? service.title;
  const description = service.seo.description ?? service.summary;
  const canonical = `/services/${service.slug}`;

  return {
    title,
    description,
    keywords: service.seo.keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: [{ url: service.image, alt: service.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [service.image],
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalizedSlug = normalizeRouteSlug(slug);
  const service = SERVICES.find((item) => item.slug === normalizedSlug);

  if (!service) {
    notFound();
  }

  const canonicalUrl = `${COMPANY_CONFIG.websiteUrl}/services/${service.slug}`;
  const structuredData: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      ...service.schema,
      "@id": `${canonicalUrl}#service`,
      url: canonicalUrl,
      description: service.seo.description ?? service.summary,
      image: new URL(service.image, COMPANY_CONFIG.websiteUrl).toString(),
      provider: { "@id": `${COMPANY_CONFIG.websiteUrl}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Trang chủ",
          item: COMPANY_CONFIG.websiteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Dịch vụ",
          item: `${COMPANY_CONFIG.websiteUrl}/services`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: service.title,
          item: canonicalUrl,
        },
      ],
    },
  ];

  if (service.faq.length > 0) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <JsonLd id="dhp-service-structured-data" data={structuredData} />
      <ServiceHero service={service} />

      <section className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]">
        <Container>
          <Breadcrumb items={[{ label: "Dịch vụ", href: "/services" }, { label: service.title }]} />
          <div className="grid gap-[var(--space-10)] lg:grid-cols-[1.6fr_0.8fr]">
            <div className="space-y-[var(--space-16)]">
              <ServiceOverview service={service} />
              <ServiceFeatures features={service.features} />
              <ServiceBenefits benefits={service.benefits} />
              <div>
                <div className="mb-[var(--space-8)]">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                    Quy trình thực hiện
                  </p>
                  <h2 className="mt-[var(--space-3)] text-3xl font-bold text-[var(--color-text)]">
                    Cách chúng tôi làm việc để bảo đảm hiệu quả
                  </h2>
                </div>
                <ServiceProcess steps={service.process} />
              </div>
              <div>
                <div className="mb-[var(--space-8)]">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                    Hình ảnh thực tế
                  </p>
                  <h2 className="mt-[var(--space-3)] text-3xl font-bold text-[var(--color-text)]">
                    Dữ liệu hình ảnh đã được xác minh
                  </h2>
                </div>
                <ServiceGallery images={service.gallery} title={service.title} />
              </div>
              <div id="faq" className="scroll-mt-24">
                <div className="mb-[var(--space-8)]">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                    Câu hỏi thường gặp
                  </p>
                  <h2 className="mt-[var(--space-3)] text-3xl font-bold text-[var(--color-text)]">
                    Những câu hỏi cần làm rõ trước khi khảo sát
                  </h2>
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

      <ServiceCTA service={service} />
    </main>
  );
}
