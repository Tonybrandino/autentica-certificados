"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Cloud,
  CreditCard,
  FileArchive,
  Headphones,
  HelpCircle,
  KeyRound,
  RefreshCw
} from "lucide-react";

const supportItems = [
  {
    icon: FileArchive,
    title: "Instalar certificado A1",
    description:
      "Veja as orientações para baixar, instalar e proteger seu certificado digital em arquivo.",
    cta: "Ver instruções"
  },
  {
    icon: CreditCard,
    title: "Instalar certificado em cartão",
    description:
      "Confira os passos para configurar seu cartão e preparar o ambiente para uso.",
    cta: "Ver instruções"
  },
  {
    icon: KeyRound,
    title: "Instalar certificado em token",
    description:
      "Confira os passos para configurar seu dispositivo e preparar o ambiente para uso.",
    cta: "Ver instruções"
  },
  {
    icon: Cloud,
    title: "Instalar Bird ID / Nuvem",
    description:
      "Entenda como acessar e utilizar seu certificado em nuvem com segurança.",
    cta: "Ver instruções"
  },
  {
    icon: RefreshCw,
    title: "Renovação de certificado",
    description:
      "Veja como renovar seu certificado e evitar interrupções no uso.",
    cta: "Como renovar"
  },
  {
    icon: HelpCircle,
    title: "Problemas de acesso",
    description:
      "Encontre orientações para resolver falhas comuns de acesso, instalação ou reconhecimento do certificado.",
    cta: "Ver soluções"
  },
  {
    icon: Headphones,
    title: "Falar com suporte",
    description:
      "Entre em contato com a equipe de suporte para receber ajuda personalizada.",
    cta: "Falar agora",
    href: "https://wa.me/5518991712107",
    highlight: true
  }
];

export function Suporte() {
  return (
    <section id="suporte" className="bg-white py-20 sm:py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Suporte</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Suporte para instalar seu Certificado Digital
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Conte com orientações simples para instalar, configurar e usar seu certificado com segurança.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supportItems.map(({ icon: Icon, title, description, cta, href, highlight }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05, duration: 0.45 }}
              whileHover={{ y: -3 }}
              className={`flex flex-col rounded-2xl border p-5 shadow-sm transition sm:p-6 ${
                highlight
                  ? "border-ocean/30 bg-gradient-to-br from-lime-50 to-green-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  highlight ? "bg-ocean text-white" : "bg-lime-50 text-ocean"
                }`}
              >
                <Icon size={21} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-black text-ink">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">{description}</p>
              <a
                href={href ?? "#suporte"}
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`focus-ring mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold smooth-ease ${
                  highlight ? "text-ocean hover:text-[#32680f]" : "text-slate-600 hover:text-ocean"
                }`}
                aria-label={`${cta}: ${title}`}
              >
                {cta}
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
