"use client";

import { motion } from "framer-motion";
import { CloudCog, HardDriveDownload, Shield } from "lucide-react";

const columns = [
  {
    title: "A1",
    icon: HardDriveDownload,
    summary: "Arquivo digital prático para rotinas recorrentes.",
    points: [
      "Arquivo digital",
      "Validade comum: 12 meses",
      "Instalação em computador ou dispositivo compatível",
      "Ideal para automações e emissão de notas",
      "Mais prático para uso frequente"
    ]
  },
  {
    title: "A3",
    icon: Shield,
    summary: "Token, cartão ou nuvem para maior controle de uso.",
    points: [
      "Token, cartão ou nuvem",
      "Validade comum: 12, 24, 30 meses ou mais conforme oferta",
      "Pode exigir mídia física ou autenticação em nuvem",
      "Maior controle de uso",
      "Boa opção para camada extra de segurança"
    ]
  }
];

export function ComparisonA1A3() {
  return (
    <section className="py-20 sm:py-24">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Comparativo</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">A1 ou A3?</h2>
            <p className="mt-4 text-base leading-7 text-muted">
              A escolha depende do volume de uso, necessidade de automação, controle de acesso e preferência por mídia
              física ou certificado em nuvem.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {columns.map(({ title, icon: Icon, summary, points }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-ocean sm:text-sm">Certificado</p>
                    <h3 className="mt-2 text-2xl font-black text-ink sm:text-3xl">{title}</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-ocean sm:h-12 sm:w-12">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{summary}</p>
                <ul className="mt-4 divide-y divide-slate-100">
                  {points.map((point) => (
                    <li key={point} className="py-3 text-sm leading-6 text-slate-700">
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-cyanx/25 bg-sky-50 p-4 text-sm font-bold text-ocean sm:items-center sm:p-5">
          <CloudCog size={22} className="mt-0.5 shrink-0 sm:mt-0" aria-hidden="true" />
          Certificado em nuvem pode combinar mobilidade com autenticação remota, conforme a oferta disponível.
        </div>
      </div>
    </section>
  );
}


