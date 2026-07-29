import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import React from "react";

import { BackToTop } from "@/components/layout/BackToTop";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { COMPANY_CONFIG } from "@/content/company";
import { SERVICES } from "@/content/services";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const SITE_NAME =
  "CÔNG TY TNHH CƠ KHÍ XÂY DỰNG ĐẠI HẢI PHÁT";

const DESCRIPTION =
  "Đại Hải Phát chuyên thiết kế, gia công và thi công Nội thất - Cơ khí dân dụng: tủ bếp, phòng ngủ, tủ quần áo, kệ TV, mái che, cổng, lan can, cầu thang và các sản phẩm theo yêu cầu.";

const DEFAULT_SOCIAL_IMAGE = {
  url: "/images/interior/interior78.webp",
  alt: "Nội thất dân dụng Đại Hải Phát",
};

const BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${COMPANY_CONFIG.websiteUrl}/#organization`,
  name: COMPANY_CONFIG.name,
  alternateName: COMPANY_CONFIG.shortName,
  url: COMPANY_CONFIG.websiteUrl,
  telephone: COMPANY_CONFIG.phones[0].raw,
  email: COMPANY_CONFIG.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY_CONFIG.address,
    addressCountry: "VN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: COMPANY_CONFIG.coordinates.lat,
    longitude: COMPANY_CONFIG.coordinates.lng,
  },
  sameAs: [COMPANY_CONFIG.googleMapsUrl, COMPANY_CONFIG.socials.zalo1],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Dịch vụ nội thất và cơ khí dân dụng",
    itemListElement: SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        url: `${COMPANY_CONFIG.websiteUrl}/services/${service.slug}`,
      },
    })),
  },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://daihaiphat.vn"),

  title: {
    default: SITE_NAME,
    template: "%s | Đại Hải Phát",
  },

  description: DESCRIPTION,

  keywords: [
    "Nội thất",
    "Nội thất gỗ",
    "Tủ bếp",
    "Tủ quần áo",
    "Phòng ngủ",
    "Kệ TV",
    "Mái che",
    "Lan can",
    "Cầu thang",
    "Cổng sắt",
    "Cơ khí dân dụng",
    "Gia công theo yêu cầu",
    "Đại Hải Phát",
  ],

  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: SITE_NAME,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    images: [DEFAULT_SOCIAL_IMAGE],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [DEFAULT_SOCIAL_IMAGE.url],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1120",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <JsonLd id="dhp-local-business" data={BUSINESS_JSON_LD} />
        <a href="#main-content" className="skip-link">
          Bỏ qua điều hướng
        </a>
        <SiteNavigation />
        <div id="main-content">{children}</div>
        <SiteFooter />
        <FloatingCta />
        <BackToTop />
      </body>
    </html>
  );
}
