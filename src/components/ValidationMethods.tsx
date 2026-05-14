"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, Laptop, MapPinCheckInside, RotateCw } from "lucide-react";
import { useState } from "react";

const methods = [
  {
    id: "video",
    title: "Videoconferência",
    icon: Laptop,
    subtitle: "Validação 100% online com atendimento guiado.",
    highlights: ["Sem deslocamento", "Agendamento rápido", "Ideal para rotina corrida"],
    whenChoose: [
      "Quando você quer resolver a emissão sem sair de casa.",
      "Quando possui câmera, documento válido e conexão estável.",
      "Quando busca praticidade com suporte remoto."
    ],
    attention: "Sujeito aos requisitos de identificação e elegibilidade da AC responsável."
  },
  {
    id: "presencial",
    title: "Presencial",
    icon: MapPinCheckInside,
    subtitle: "Atendimento em ponto físico com suporte assistido.",
    highlights: ["Acompanhamento próximo", "Conferência no local", "Opção tradicional"],
    whenChoose: [
      "Quando prefere atendimento presencial com apoio direto.",
      "Quando o fluxo por vídeo não estiver disponível para o seu caso.",
      "Quando deseja orientação passo a passo no balcão."
    ],
    attention: "A disponibilidade depende da unidade e agenda de atendimento."
  },
  {
    id: "renovacao",
    title: "Renovação automática",
    icon: RotateCw,
    subtitle: "Fluxo simplificado para titulares elegíveis.",
    highlights: ["Menos etapas", "Mais velocidade", "Evita vencimento em cima da hora"],
    whenChoose: [
      "Quando você já possui certificado anterior elegível para renovação.",
      "Quando quer concluir o processo com o mínimo de atrito.",
      "Quando precisa manter a operação sem interrupções."
    ],
    attention: "Se não houver elegibilidade, você segue para videoconferência ou presencial."
  }
] as const;

export function ValidationMethods() {
  const [activeId, setActiveId] = useState<((typeof methods)[number]["id"] | null)>(null);

  return (
    <section id="validacao" className="py-20 sm:py-24">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-ocean">Validação</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Qual forma de validação combina com você?
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Passe o mouse em cada opção para ver quando usar e o que considerar antes de iniciar sua compra.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-4 lg:grid-cols-3">
          {methods.map(({ id, title, icon: Icon, subtitle, highlights, whenChoose, attention }, index) => {
            const isOpen = activeId === id;

            return (
              <motion.article
                key={id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                onMouseEnter={() => setActiveId(id)}
                onMouseLeave={() => setActiveId((prev) => (prev === id ? null : prev))}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                  isOpen ? "border-ocean/45 shadow-soft" : "border-slate-200"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`validacao-panel-${id}`}
                  onFocus={() => setActiveId(id)}
                  onClick={() => setActiveId(id)}
                  className="focus-ring w-full p-5 text-left sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isOpen ? "bg-ocean text-white" : "bg-sky-50 text-ocean"}`}>
                        <Icon size={24} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black tracking-tight text-ink">{title}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted">{subtitle}</p>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`mt-1 shrink-0 text-ocean transition ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-4 text-xs font-semibold text-slate-500">Passe o mouse para ver detalhes</p>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`validacao-panel-${id}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24 }}
                      className="overflow-hidden border-t border-slate-200 bg-slate-50/70"
                    >
                      <div className="p-5 sm:p-6">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-ocean">Quando escolher</p>
                        <ul className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                          {highlights.map((item) => (
                            <li
                              key={item}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 sm:text-sm"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                        <ul className="mt-3 space-y-2.5">
                          {whenChoose.map((point) => (
                            <li key={point} className="flex gap-2 text-sm leading-6 text-slate-700">
                              <CheckCircle2 size={16} className="mt-1 shrink-0 text-ocean" aria-hidden="true" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 rounded-xl border border-sky-100 bg-white px-4 py-3 text-xs leading-6 text-slate-600 sm:text-sm">
                          {attention}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
