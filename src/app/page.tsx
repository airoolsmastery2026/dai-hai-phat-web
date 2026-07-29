import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AIOfficeSection } from "@/components/sections/AIOfficeSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <HeroSection />
      <ServicesSection />
      <AIOfficeSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
