"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gift, RefreshCw, TrendingUp, Users } from "lucide-react";

const cashbackBenefits = [
  {
    icon: TrendingUp,
    title: "Gere recorrência",
    description: "Transforme movimentações do dia a dia em benefícios concretos para sua empresa."
  },
  {
    icon: Users,
    title: "Fidelize clientes",
    description: "Fortaleça o relacionamento com sua base e incentive novas interações."
  },
  {
    icon: Gift,
    title: "Valor real em cashback",
    description: "Seu negócio acumula benefícios a cada operação, sem complexidade operacional."
  },
  {
    icon: RefreshCw,
    title: "Ciclo virtuoso",
    description: "Cashback gera engajamento, que gera mais movimentação — um ciclo de crescimento sustentável."
  }
];

export function SaudeNegocio() {
  return (
    <section id="saude" className="py-20 sm:py-24">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Saúde do Seu Negócio</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Cashback OKAY
            </h2>
            <p className="mt-5 text-base leading-7 text-muted">
              Com o{" "}
              <strong className="font-black text-ink">Cashback OKAY</strong>, sua empresa transforma
              movimentações e oportunidades em benefícios reais. Uma solução pensada para fortalecer o
              relacionamento com clientes, gerar recorrência e agregar valor ao seu negócio.
            </p>
            <a
              href="#fale-conosco"
              className="focus-ring mt-7 inline-flex items-center gap-2 rounded-full bg-ocean px-6 py-3 text-sm font-extrabold text-white shadow-soft smooth-ease hover:-translate-y-0.5 hover:bg-[#006B9A]"
            >
              Saiba mais
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {cashbackBenefits.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.07, duration: 0.45 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-ocean">
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
