"use client";
import { Navbar } from "@/components/shared/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ToolsGrid } from "@/components/landing/ToolsGrid";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { Footer } from "@/components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ToolsGrid />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default LandingPage;
