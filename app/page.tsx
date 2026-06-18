import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import CTASection from "@/components/cta-section";
import HomeContent from "@/components/home-content";
import NewsSection from "@/components/news-section";
import ServicesSection from "@/components/services-section";
export default function Home() {
  return (
    <main className="min-h-screen bg-background w-full overflow-x-hidden">
      <div className="w-full max-w-[100vw]">
        <Header />
        <HeroSection />
        {/* <HomeContent /> */}
        <ServicesSection />
        <NewsSection />
        <CTASection />
        <Footer />
      </div>
      {/* Removed Chatbot since it's already in layout.tsx */}
    </main>
  );
}
