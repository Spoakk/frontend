import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0c0c0f]">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
