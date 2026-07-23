import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import React from "react";

import { JsonLd } from "@/components/seo/JsonLd";
import { COMPANY_CONFIG } from "@/content/company";
import { FAQ_ITEMS } from "@/content/faq";
import { FEATURED_PROJECTS } from "@/content/projects";
import { SERVICES } from "@/content/services";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const title = "CÔNG TY TNHH CƠ KHÍ XÂY DỰNG ĐẠI HẢI PHÁT";
const description = "Đại Hải Phát cung cấp giải pháp nội thất công nghiệp, vật liệu composite và kết cấu thép với quy trình thiết kế, sản xuất và thi công chuyên nghiệp.";

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY_CONFIG.websiteUrl),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  keywords: ["cơ khí", "nội thất", "composite", "kết cấu thép", "gia công CNC", "thi công nội thất"],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "vi_VN",
    url: COMPANY_CONFIG.websiteUrl,
    siteName: title,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FF5722",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_CONFIG.name,
    url: COMPANY_CONFIG.websiteUrl,
    logo: `${COMPANY_CONFIG.websiteUrl}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY_CONFIG.primaryPhone,
      contactType: "customer service",
      availableLanguage: ["Vietnamese"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_CONFIG.address,
      addressCountry: "VN",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY_CONFIG.name,
    url: COMPANY_CONFIG.websiteUrl,
    telephone: COMPANY_CONFIG.primaryPhone,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_CONFIG.address,
      addressCountry: "VN",
    },
    description,
  };

  const serviceSchemas = SERVICES.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.desc,
    provider: {
      "@type": "Organization",
      name: COMPANY_CONFIG.name,
    },
  }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: COMPANY_CONFIG.websiteUrl },
      { "@type": "ListItem", position: 2, name: "Dịch vụ", item: `${COMPANY_CONFIG.websiteUrl}/#services` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const projectSchemas = FEATURED_PROJECTS.map((project) => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    about: project.category,
  }));

  return (
    <html lang="vi">
      <body className={`${inter.className} min-h-screen bg-slate-50`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900">
          Bỏ qua nội dung chính
        </a>
        {children}
        <JsonLd data={organizationSchema} />
        <JsonLd data={localBusinessSchema} />
        {serviceSchemas.map((schema, index) => (
          <JsonLd key={`${schema.name}-${index}`} data={schema} />
        ))}
        <JsonLd data={breadcrumbSchema} />
        <JsonLd data={faqSchema} />
        {projectSchemas.map((schema, index) => (
          <JsonLd key={`${schema.name}-${index}`} data={schema} />
        ))}
      </body>
    </html>
  );
}
