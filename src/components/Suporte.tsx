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
    title: "Instalar Certificado A1",
    description: "Passo a passo para instalar o certificado A1 (arquivo) no Windows, Mac ou no navegador.",
    cta: "Ver instruções"
  },
  {
    icon: CreditCard,
    title: "Instalar Certificado em Cartão",
    description: "Como instalar o driver do cartão e configurar o leitor para uso do certificado A3.",
    cta: "Ver instruções"
  },
  {
    icon: KeyRound,
    title: "Instalar Certificado em Token",
    description: "Instalação do driver do token USB e configuração para uso em diferentes sistemas.",
    cta: "Ver instruções"
  },
  {
    icon: Cloud,
    title: "Instalar Bird ID / Nuvem",
    description: "Como ativar e configurar o certificado em nuvem pelo aplicativo Bird ID.",
    cta: "Ver instruções"
  },
  {
    icon: RefreshCw,
    title: "Renovação de Certificado",
    description: "Entenda quando e como renovar seu certificado antes do vencimento, sem perder acesso.",
    cta: "Como renovar"
  },
  {
    icon: HelpCircle,
    title: "Problemas de Acesso",
    description: "Soluções para erros comuns: certificado não reconhecido, senha bloqueada ou token com falha.",
    cta: "Ver soluções"
  },
  {
    icon: Headphones,
    title: "Falar com Suporte",
    description: "Não encontrou o que precisava? Nossa equipe está pronta para te ajudar via WhatsApp ou chat.",
    cta: "Falar agora",
    href: "#fale-conosco",
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
            Instalar Certificado
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Encontre orientações para instalar, configurar e solucionar problemas com seu certificado digital.
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
                  ? "border-ocean/30 bg-gradient-to-br from-sky-50 to-cyan-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  highlight ? "bg-ocean text-white" : "bg-sky-50 text-ocean"
                }`}
              >
                <Icon size={21} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-black text-ink">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">{description}</p>
              <a
                href={href ?? "#suporte"}
                className={`focus-ring mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold smooth-ease ${
                  highlight ? "text-ocean hover:text-[#006B9A]" : "text-slate-600 hover:text-ocean"
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
