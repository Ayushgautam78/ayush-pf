import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SwordIntroSection } from "@/components/SwordIntroSection";
import { ContributionSection } from "@/components/ContributionSection";
import { ContentShowcaseSection } from "@/components/ContentShowcaseSection";
import { AboutSection } from "@/components/AboutSection";
import { JourneySection } from "@/components/JourneySection";
import { ContactGatewaySection } from "@/components/ContactGatewaySection";
import { Footer } from "@/components/Footer";
import { Reveals } from "@/components/Reveals";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Reveals />
      
      {/* 3D Interactive Hermes Head in Hero */}
      <HeroSection />

      {/* The Greek Celestial Sword Discovery & Physical Unsheathe */}
      <SwordIntroSection />

      {/* Ecosystem Contributions with Cinematic Ruins Video */}
      <ContributionSection />

      {/* Content Showcase Section: Live Applications, Creator Suites & Autonomous Bots */}
      <ContentShowcaseSection />

      {/* About & Persona Pills & Vector Tech Badges */}
      <AboutSection />

      {/* Journey Timeline (Sword travels along spine) */}
      <JourneySection />

      {/* Contact Gateway: Inspired by Pamidor "OPEN THE DOOR" */}
      <ContactGatewaySection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
