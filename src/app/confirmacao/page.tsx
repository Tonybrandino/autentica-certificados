import { Suspense } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PaymentConfirmation } from "@/components/PaymentConfirmation";

export default function ConfirmationPage() {
  return (
    <main className="overflow-hidden">
      <Header />
      <Suspense
        fallback={
          <section className="section-shell min-h-[60vh] pt-28">
            <p className="text-sm font-bold text-slate-500">Carregando confirmação...</p>
          </section>
        }
      >
        <PaymentConfirmation />
      </Suspense>
      <Footer />
    </main>
  );
}
