import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { ServiceHero } from "@/components/services/ServiceHero";
import { JsonLd } from "@/components/seo/JsonLd";
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
      <ServiceDetailContent service={service} />
      <ServiceCTA service={service} />
    </main>
  );
}
