"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Bell, Shield, TrendingUp } from "lucide-react";

const healthCards = [
  {
    icon: TrendingUp,
    title: "Monitore seu CNPJ",
    description:
      "Acompanhe alterações importantes ligadas à sua empresa e receba alertas sempre que houver movimentações relevantes que possam impactar sua operação."
  },
  {
    icon: Shield,
    title: "Acompanhe sua reputação no mercado",
    description:
      "Entenda melhor como sua empresa é percebida e tenha mais clareza para cuidar da credibilidade do seu negócio."
  },
  {
    icon: Bell,
    title: "Receba alertas de risco",
    description:
      "Seja avisado sobre eventos que podem indicar risco financeiro, como pendências, protestos, consultas, alterações cadastrais e sinais de negativação."
  },
  {
    icon: AlertTriangle,
    title: "Proteja suas relações comerciais",
    description:
      "Monitore clientes, fornecedores e parceiros para negociar com mais segurança e reduzir riscos de inadimplência ou surpresas comerciais."
  }
];

export function SaudeNegocio() {
  return (
    <section id="saude" className="relative overflow-hidden bg-[#254f0f] py-20 text-white sm:py-24">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(126,208,56,0.32),transparent_30rem),linear-gradient(135deg,rgba(63,127,18,0.88),rgba(42,89,14,0.96)_52%,rgba(20,45,9,1))]"
        aria-hidden="true"
      />
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyanx/20 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

      <div className="section-shell relative">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-lime-50">
                Saúde do Seu Negócio
              </p>
              <span className="inline-flex items-center rounded-full border border-white/25 bg-white/12 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-white">
                Produto adicional
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              Acompanhe a saúde da sua empresa antes que o risco vire problema
            </h2>
            <p className="mt-5 text-base leading-7 text-lime-50/90">
              Com o{" "}
              <strong className="font-black text-white">Saúde do Seu Negócio</strong>, você monitora
              informações importantes da sua empresa, acompanha movimentações relevantes no seu CNPJ
              e recebe alertas para agir com mais segurança antes de tomar decisões comerciais.
            </p>
            <a
              href="#fale-conosco"
              className="focus-ring mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-ocean shadow-lift smooth-ease hover:-translate-y-0.5 hover:bg-lime-50"
            >
              Conhecer o produto
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {healthCards.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.07, duration: 0.45 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-white/18 bg-white p-5 text-ink shadow-[0_18px_50px_rgba(20,45,9,0.24)] transition"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-50 text-ocean">
                  <Icon size={21} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-black text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
