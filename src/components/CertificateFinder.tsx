"use client";

import { motion } from "framer-motion";
import { Building2, UserRound } from "lucide-react";
import { useState } from "react";

const options = [
  {
    id: "pessoa-fisica",
    label: "Sou pessoa física",
    icon: UserRound,
    recommendation: "e-CPF A1, e-CPF A3 ou Certificado em Nuvem",
    copy: "Para assinatura digital, acesso ao gov.br, e-CAC e serviços vinculados ao CPF."
  },
  {
    id: "pessoa-juridica",
    label: "Sou pessoa jurídica",
    icon: Building2,
    recommendation: "e-CNPJ A1, e-CNPJ A3, Nuvem ou NF-e",
    copy: "Para representar a empresa, emitir nota fiscal e cumprir obrigações digitais."
  }
];

export function CertificateFinder() {
  const [selectedId, setSelectedId] = useState(options[0].id);
  const selected = options.find((option) => option.id === selectedId) ?? options[0];

  return (
    <section id="assistente" className="py-20 sm:py-24">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Assistente de escolha</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Qual certificado você precisa?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted">
              Selecione o perfil do titular para receber a recomendação e seguir para escolher os produtos.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {options.map(({ id, label, icon: Icon }) => {
                const active = id === selectedId;
                return (
                  <motion.button
                    type="button"
                    key={id}
                    onClick={() => setSelectedId(id)}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    className={`focus-ring flex min-h-24 flex-col items-start justify-between rounded-lg border p-4 text-left transition ${
                      active
                        ? "border-ocean bg-sky-50 text-ocean shadow-sm"
                        : "border-slate-200 bg-white text-ink hover:border-cyanx/45 hover:shadow-sm"
                    }`}
                  >
                    <Icon size={22} aria-hidden="true" />
                    <span className="text-sm font-black">{label}</span>
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-lg border border-cyanx/25 bg-gradient-to-br from-sky-50 to-white p-5"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-ocean">Recomendação</p>
              <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-ink sm:text-2xl">{selected.recommendation}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{selected.copy}</p>
                </div>
                <motion.a
                  href="#certificados"
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  className="focus-ring inline-flex justify-center rounded-lg bg-ink px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-ocean"
                >
                  Selecionar produtos
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


