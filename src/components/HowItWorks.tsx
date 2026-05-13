"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CreditCard, DownloadCloud, FileSearch } from "lucide-react";

const steps = [
  {
    title: "Escolha seu certificado",
    icon: FileSearch,
    copy: "Compare os modelos e selecione a validade que melhor atende sua rotina."
  },
  {
    title: "Faça o pagamento",
    icon: CreditCard,
    copy: "Inicie o pedido em ambiente seguro e receba orientações para seguir."
  },
  {
    title: "Valide sua identidade",
    icon: BadgeCheck,
    copy: "Escolha videoconferência, presencial ou renovação automática para elegíveis."
  },
  {
    title: "Receba e instale",
    icon: DownloadCloud,
    copy: "Conclua a emissão e conte com suporte para instalação quando precisar."
  }
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-white py-20 sm:py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-ocean">Como funciona</p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Da escolha à emissão, em 4 etapas
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Fluxo simples e guiado para o cliente decidir rápido sem perder segurança na jornada.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:hidden">
          {steps.map(({ title, icon: Icon, copy }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-ocean">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                  Etapa {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-extrabold tracking-tight text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 hidden gap-4 lg:flex">
          {steps.map(({ title, icon: Icon, copy }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              className="group min-h-[140px] flex-1 self-start overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-500 hover:min-h-[220px] hover:flex-[1.85] hover:border-ocean/35 hover:p-6 hover:shadow-lift"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-ocean transition-colors duration-300 group-hover:bg-ocean group-hover:text-white">
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-xl font-extrabold tracking-tight text-ink group-hover:mt-5">{title}</h3>

              <div className="mt-0 max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:mt-4 group-hover:max-h-40 group-hover:opacity-100">
                <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 inline-block">
                  Etapa {index + 1}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-sky-400/25 bg-gradient-to-r from-[#0f172a] via-[#0078AE] to-[#00B3F5] p-5 text-center shadow-soft sm:p-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 28%, rgba(255,255,255,0.2) 0 2px, transparent 2px), radial-gradient(circle at 78% 68%, rgba(255,255,255,0.18) 0 2px, transparent 2px)",
              backgroundSize: "28px 28px, 30px 30px"
            }}
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-7xl font-black leading-none text-white/15 sm:text-8xl"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <span
            className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-7xl font-black leading-none text-white/15 sm:text-8xl"
            aria-hidden="true"
          >
            &rdquo;
          </span>
          <div className="pointer-events-none absolute -left-10 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-[#00B3F5]/40 blur-2xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full bg-[#0f172a]/50 blur-2xl" aria-hidden="true" />
          <p className="relative text-base font-black tracking-tight text-white sm:text-lg">
            Em poucos cliques, o cliente define modelo, validade e validação para seguir com a compra.
          </p>
        </div>
      </div>
    </section>
  );
}


