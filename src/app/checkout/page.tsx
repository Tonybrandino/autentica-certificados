import { Suspense } from "react";

import { Checkout } from "@/components/Checkout";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function CheckoutPage() {
  return (
    <main className="overflow-hidden">
      <Header />
      <Suspense
        fallback={
          <section className="section-shell min-h-[60vh] pt-28">
            <p className="text-sm font-bold text-slate-500">Carregando checkout...</p>
          </section>
        }
      >
        <Checkout />
      </Suspense>
      <Footer />
    </main>
  );
}
