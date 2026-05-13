import { Benefits } from "@/components/Benefits";
import { CertificateFinder } from "@/components/CertificateFinder";
import { ComparisonA1A3 } from "@/components/ComparisonA1A3";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ProductGrid } from "@/components/ProductGrid";
import { SocialProof } from "@/components/SocialProof";
import { ValidationMethods } from "@/components/ValidationMethods";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Header />
      <Hero />
      <CertificateFinder />
      <ProductGrid />
      <ValidationMethods />
      <HowItWorks />
      <SocialProof />
      <Benefits />
      <ComparisonA1A3 />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

