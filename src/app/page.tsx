import { Benefits } from "@/components/Benefits";
import { Contato } from "@/components/Contato";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ProductGrid } from "@/components/ProductGrid";
import { SaudeNegocio } from "@/components/SaudeNegocio";
import { SocialProof } from "@/components/SocialProof";
import { Suporte } from "@/components/Suporte";
import { ValidationMethods } from "@/components/ValidationMethods";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Header />
      <div className="relative mb-10 overflow-hidden sm:mb-14 lg:mb-16">
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f8fbff] via-white to-[#eef6ff]"
          aria-hidden="true"
        />
        <div
          className="absolute left-0 right-0 top-24 -z-10 mx-auto h-[34rem] max-w-6xl rounded-full bg-sky-200/30 blur-3xl"
          aria-hidden="true"
        />
        <Hero />
        <ProductGrid />
      </div>
      <ValidationMethods />
      <HowItWorks />
      <SocialProof />
      <Benefits />
      <SaudeNegocio />
      <Suporte />
      <FAQ />
      <Contato />
      <FinalCTA />
      <Footer />
    </main>
  );
}
