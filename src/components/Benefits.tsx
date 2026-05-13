"use client";

import { motion } from "framer-motion";
import {
  Building,
  ClipboardSignature,
  FileCheck2,
  Headphones,
  Landmark,
  Lock,
  Receipt,
  Zap
} from "lucide-react";

const benefits = [
  { title: "Assine documentos com validade jurídica", icon: ClipboardSignature },
  { title: "Acesse sistemas do governo", icon: Landmark },
  { title: "Emita notas fiscais", icon: Receipt },
  { title: "Reduza burocracia", icon: FileCheck2 },
  { title: "Ganhe agilidade nos processos", icon: Zap },
  { title: "Segurança com criptografia", icon: Lock },
  { title: "Atendimento online ou presencial", icon: Building },
  { title: "Suporte para instalação", icon: Headphones }
];

export function Benefits() {
  return (
    <section id="beneficios" className="bg-white py-20 sm:py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Benefícios</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Menos burocracia, mais segurança operacional
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ title, icon: Icon }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.04, duration: 0.45 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyanx/45 hover:shadow-soft"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0078AE] to-[#00B3F5]" />
                <div className="absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#00B3F5]/35 blur-2xl" />
                <div className="absolute -right-8 top-2 h-20 w-20 rounded-full bg-[#0f172a]/45 blur-2xl" />
              </div>
              <div className="relative z-[1] flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-ocean transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white">
                <Icon size={21} aria-hidden="true" />
              </div>
              <h3 className="relative z-[1] mt-5 text-base font-black leading-6 text-ink transition-colors duration-300 group-hover:text-white">
                {title}
              </h3>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {[
            "Evite perder prazos por certificado vencido",
            "Compre hoje e agende sua validação",
            "Atendimento online disponível",
            "Suporte na instalação",
            "Ambiente seguro"
          ].map((trigger) => (
            <span
              key={trigger}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 sm:text-sm"
            >
              {trigger}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

