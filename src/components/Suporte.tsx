"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Cloud,
  CreditCard,
  Download,
  FileArchive,
  Headphones,
  HelpCircle,
  KeyRound,
  Maximize2,
  RefreshCw,
  X,
  type LucideIcon
} from "lucide-react";
import { useState } from "react";

type SupportItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  pdfSlug?: string;
  href?: string;
  highlight?: boolean;
};

const supportItems: SupportItem[] = [
  {
    icon: FileArchive,
    title: "Instalar certificado A1",
    description:
      "Veja as orientações para baixar, instalar e proteger seu certificado digital em arquivo.",
    cta: "Ver instruções",
    pdfSlug: "certificado-a1"
  },
  {
    icon: CreditCard,
    title: "Instalar certificado em cartão",
    description:
      "Confira os passos para configurar seu cartão e preparar o ambiente para uso.",
    cta: "Ver instruções",
    pdfSlug: "certificado-cartao"
  },
  {
    icon: KeyRound,
    title: "Instalar certificado em token",
    description:
      "Confira os passos para configurar seu dispositivo e preparar o ambiente para uso.",
    cta: "Ver instruções",
    pdfSlug: "certificado-token"
  },
  {
    icon: Cloud,
    title: "Instalar Bird ID / Nuvem",
    description:
      "Entenda como acessar e utilizar seu certificado em nuvem com segurança.",
    cta: "Ver instruções",
    pdfSlug: "bird-id-nuvem"
  },
  {
    icon: RefreshCw,
    title: "Renovação de certificado",
    description:
      "Veja como renovar seu certificado e evitar interrupções no uso.",
    cta: "Como renovar",
    pdfSlug: "renovacao-certificado"
  },
  {
    icon: HelpCircle,
    title: "Problemas de acesso",
    description:
      "Encontre orientações para resolver falhas comuns de acesso, instalação ou reconhecimento do certificado.",
    cta: "Ver soluções",
    pdfSlug: "problemas-acesso"
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
  const [selectedPdf, setSelectedPdf] = useState<SupportItem | null>(null);
  const pdfUrl = selectedPdf && "pdfSlug" in selectedPdf ? `/api/suporte-pdf/${selectedPdf.pdfSlug}` : "";

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
          {supportItems.map(({ icon: Icon, title, description, cta, href, highlight, pdfSlug }, index) => {
            const opensPdf = Boolean(pdfSlug);
            const openPdf = () => {
              if (!pdfSlug) {
                return;
              }

              setSelectedPdf({
                icon: Icon,
                title,
                description,
                cta,
                pdfSlug
              });
            };

            return (
              <motion.article
                key={title}
                role={opensPdf ? "button" : undefined}
                tabIndex={opensPdf ? 0 : undefined}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.45 }}
                whileHover={{ y: -3 }}
                onClick={opensPdf ? openPdf : undefined}
                onKeyDown={
                  opensPdf
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openPdf();
                        }
                      }
                    : undefined
                }
                className={`focus-ring group flex flex-col rounded-2xl border p-5 shadow-sm transition sm:p-6 ${
                  highlight
                    ? "border-ocean/30 bg-gradient-to-br from-lime-50 to-green-50"
                    : "border-slate-200 bg-white"
                } ${opensPdf ? "cursor-pointer hover:border-ocean/30 hover:bg-lime-50/30" : ""}`}
                aria-label={opensPdf ? `${cta}: ${title}` : undefined}
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
                {opensPdf ? (
                  <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-extrabold text-slate-600 smooth-ease group-hover:text-ocean">
                    {cta}
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                ) : (
                  <a
                    href={href}
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="focus-ring mt-5 inline-flex w-fit items-center gap-1.5 rounded-full text-sm font-extrabold text-ocean smooth-ease hover:text-[#32680f]"
                    aria-label={`${cta}: ${title}`}
                  >
                    {cta}
                    <ArrowRight size={14} aria-hidden="true" />
                  </a>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedPdf && pdfUrl && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-pdf-title"
            onClick={() => setSelectedPdf(null)}
          >
            <motion.div
              className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-ocean">PDF de exemplo</p>
                  <h3 id="support-pdf-title" className="mt-1 text-lg font-black text-ink">
                    {selectedPdf.title}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 smooth-ease hover:border-ocean/40 hover:bg-lime-50 hover:text-ocean"
                  >
                    <Maximize2 size={16} aria-hidden="true" />
                    Abrir
                  </a>
                  <a
                    href={`${pdfUrl}?download=1`}
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-ocean px-4 py-2 text-sm font-extrabold text-white smooth-ease hover:bg-[#32680f]"
                    download
                  >
                    <Download size={16} aria-hidden="true" />
                    Baixar PDF
                  </a>
                  <button
                    type="button"
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 smooth-ease hover:bg-slate-50 hover:text-ink"
                    aria-label="Fechar PDF"
                    onClick={() => setSelectedPdf(null)}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <iframe
                title={`Leitor de PDF - ${selectedPdf.title}`}
                src={pdfUrl}
                className="h-[68vh] w-full bg-slate-100"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
