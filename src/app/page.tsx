import type { Metadata } from "next";
import { Suspense } from "react";

import { AIOfficeRouteEntry } from "@/components/sections/AIOfficeRouteEntry";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";

const HOME_TITLE = "Nội thất & cơ khí dân dụng cho nhà ở";
const HOME_DESCRIPTION =
  "Đại Hải Phát tư vấn, thiết kế và thi công nội thất, cửa cổng, cầu thang, lan can và mái che cho nhà phố, căn hộ và biệt thự theo hiện trạng thực tế.";
const HOME_IMAGE = "/images/interior/interior78.webp";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: HOME_IMAGE, alt: "Nội thất dân dụng Đại Hải Phát" }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [HOME_IMAGE],
  },
};

function AIOfficeFallback() {
  return (
    <section
      id="ai-office"
      className="ai-office-light scroll-mt-16 border-y border-[var(--color-border)] bg-[var(--color-background)] py-[var(--space-section)] text-[var(--color-text-inverse)] lg:py-[var(--space-section-lg)]"
      aria-label="Đang chuẩn bị trợ lý tư vấn"
      aria-busy="true"
    >
      <div className="mx-auto max-w-7xl px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
        <p className="font-bold text-[var(--color-primary-soft-text)]">
          Đang chuẩn bị hồ sơ tư vấn kỹ thuật…
        </p>
      </div>
    </section>
  );
}

export default function HomePage() {
  const liveVoiceEnabled = Boolean(process.env.GEMINI_API_KEY?.trim());

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <HeroSection />
      <ServicesSection />
      <Suspense fallback={<AIOfficeFallback />}>
        <AIOfficeRouteEntry liveVoiceEnabled={liveVoiceEnabled} />
      </Suspense>
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
