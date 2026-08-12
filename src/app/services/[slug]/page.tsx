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
import { getPublicRouteSlug, normalizeRouteSlug } from "@/lib/routing";

export async function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: getPublicRouteSlug(service.slug) }));
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
  const publicSlug = getPublicRouteSlug(service.slug);
  const canonical = `/services/${publicSlug}`;

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

  const publicSlug = getPublicRouteSlug(service.slug);
  const canonicalUrl = `${COMPANY_CONFIG.websiteUrl}/services/${publicSlug}`;
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

      <section className="py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
        <Container>
          <Breadcrumb items={[{ label: "Dịch vụ", href: "/services" }, { label: service.title }]} />
          <div className="mt-[var(--space-5)] grid gap-[var(--space-6)] lg:grid-cols-[1.65fr_0.7fr] lg:gap-[var(--space-8)]">
            <div className="space-y-[var(--space-8)] sm:space-y-[var(--space-10)]">
              <ServiceOverview service={service} />

              <section aria-labelledby="service-features-title">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                  Điểm chính
                </p>
                <h2 id="service-features-title" className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)]">
                  Cấu tạo và phạm vi cần lưu ý
                </h2>
                <div className="mt-[var(--space-4)]">
                  <ServiceFeatures features={service.features} />
                </div>
              </section>

              <ServiceBenefits benefits={service.benefits} />

              <section aria-labelledby="service-process-title">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                  Quy trình
                </p>
                <h2 id="service-process-title" className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)]">
                  Từ hiện trạng đến thi công
                </h2>
                <div className="mt-[var(--space-4)]">
                  <ServiceProcess steps={service.process} />
                </div>
              </section>

              <section aria-labelledby="service-gallery-title">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                  Hình ảnh
                </p>
                <h2 id="service-gallery-title" className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)]">
                  Mẫu đã được xác minh
                </h2>
                <div className="mt-[var(--space-4)]">
                  <ServiceGallery images={service.gallery} title={service.title} />
                </div>
              </section>

              <section id="faq" className="scroll-mt-20" aria-labelledby="service-faq-title">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                  Câu hỏi thường gặp
                </p>
                <h2 id="service-faq-title" className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)]">
                  Cần làm rõ trước khảo sát
                </h2>
                <div className="mt-[var(--space-4)]">
                  <ServiceFAQ items={service.faq} />
                </div>
              </section>
            </div>

            <div className="hidden lg:block lg:pl-[var(--space-2)]">
              <ServiceSidebar service={service} />
            </div>
          </div>
        </Container>
      </section>

      <ServiceCTA service={service} />
    </main>
  );
}
