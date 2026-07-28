import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";

import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AIOfficeSection } from "@/components/sections/AIOfficeSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      <SiteNavigation />

      <main>

        <HeroSection />

        <ServicesSection />

        <AIOfficeSection />

        <ProjectsSection />

        <ContactSection />

      </main>

      <SiteFooter />

    </div>
  );
}
