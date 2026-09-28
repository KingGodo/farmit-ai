import Navbar from "@/components/landing/sections/nav";
import Hero from "@/components/landing/sections/hero";
import Features from "@/components/landing/sections/features";
import HowItWorks from "@/components/landing/sections/howItWorks";
import Stats from "@/components/landing/sections/stats";
import Testimonials from "@/components/landing/sections/testimonials";
import CTA from "@/components/landing/sections/cta";
import Footer from "@/components/landing/sections/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
