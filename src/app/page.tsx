import dynamic from "next/dynamic";
import { Suspense } from "react";

import { BackToTop } from "@/components/layout/BackToTop";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { TopBar } from "@/components/layout/TopBar";
import { ArticlesSection } from "@/components/sections/ArticlesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { QuoteFormSection } from "@/components/sections/QuoteFormSection";

const AboutSection = dynamic(() => import("@/components/sections/AboutSection").then((mod) => mod.AboutSection), { loading: () => null });
const ContactSection = dynamic(() => import("@/components/sections/ContactSection").then((mod) => mod.ContactSection), { loading: () => null });

export default function DaiHaiPhatModernPlatform() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <TopBar />
      <SiteNavigation />
      <main id="main-content">
        <HeroSection />
        <Suspense fallback={null}>
          <AboutSection />
        </Suspense>
        <ServicesSection />
        <ProjectsSection />
        <ArticlesSection />
        <ProcessSection />
        <TestimonialsSection />
        <QuoteFormSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <FloatingCta />
      <BackToTop />
    </div>
  );
}
