"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { useState } from "react";

export function FinalCTA() {
  const [glow, setGlow] = useState({ x: 50, y: 50, active: false });

  return (
    <section id="comprar" className="py-20 sm:py-24">
      <div className="section-shell">
        <div
          className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-r from-ocean to-[#00B3F5] px-5 py-10 text-white shadow-lift sm:px-10 sm:py-12 lg:px-14"
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            setGlow({ x, y, active: true });
          }}
          onMouseLeave={() => setGlow((prev) => ({ ...prev, active: false }))}
        >
          <div
            className={`pointer-events-none absolute h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-3xl transition-opacity duration-300 ${
              glow.active ? "opacity-100" : "opacity-0"
            }`}
            style={{ left: `${glow.x}%`, top: `${glow.y}%` }}
            aria-hidden="true"
          />
          <div
            className={`pointer-events-none absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0f172a]/20 blur-2xl transition-opacity duration-300 ${
              glow.active ? "opacity-100" : "opacity-0"
            }`}
            style={{ left: `${glow.x}%`, top: `${glow.y}%` }}
            aria-hidden="true"
          />
          <div className="absolute -right-14 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-100">Emissão segura</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Pronto para emitir seu certificado digital?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-sky-50 sm:mt-5 sm:text-base">
              Escolha o modelo ideal e inicie sua compra com segurança em um fluxo rápido e orientado.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#certificados"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-ocean smooth-ease hover:-translate-y-0.5"
              >
                Comprar certificado
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a
                href="https://wa.me/5518991712107"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-sm font-extrabold text-white smooth-ease hover:-translate-y-0.5 hover:bg-white/10"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Falar com especialista
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
