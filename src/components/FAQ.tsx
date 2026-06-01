"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

type DocCategory = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  docs: string[];
  notes: string;
};

const docCategories: DocCategory[] = [
  {
    id: "pf",
    label: "Pessoa Física",
    title: "Pessoa Física",
    subtitle: "Documentos necessários",
    docs: [
      "Documento de identificação com foto",
      "CPF",
      "Comprovante de dados cadastrais, quando solicitado",
      "Presença do titular ou validação conforme o modelo escolhido"
    ],
    notes:
      "A documentação pode variar conforme o tipo de certificado, natureza jurídica e regras de validação. Em caso de dúvida, fale com nosso suporte antes de iniciar a emissão."
  },
  {
    id: "pj",
    label: "Pessoa Jurídica",
    title: "Pessoa Jurídica",
    subtitle: "Documentos necessários",
    docs: [
      "Documento de identificação do responsável",
      "CPF do responsável",
      "Documentos da empresa",
      "Comprovantes e atos constitutivos conforme o tipo de entidade"
    ],
    notes:
      "A documentação pode variar conforme o tipo de certificado, natureza jurídica e regras de validação. Em caso de dúvida, fale com nosso suporte antes de iniciar a emissão."
  },
  {
    id: "mei",
    label: "MEI",
    title: "MEI",
    subtitle: "Documentos necessários",
    docs: [
      "Documento de identificação com foto do titular",
      "CPF do titular",
      "Certificado da Condição de Microempreendedor Individual, CCMEI",
      "Comprovante de inscrição no CNPJ"
    ],
    notes:
      "A documentação pode variar conforme o tipo de certificado, natureza jurídica e regras de validação. Em caso de dúvida, fale com nosso suporte antes de iniciar a emissão."
  },
  {
    id: "ltda",
    label: "Empresa LTDA",
    title: "Empresa LTDA",
    subtitle: "Documentos necessários",
    docs: [
      "Documento de identificação dos sócios responsáveis",
      "CPF dos sócios responsáveis",
      "Contrato social e alterações vigentes",
      "Comprovante de inscrição no CNPJ"
    ],
    notes:
      "A documentação pode variar conforme o tipo de certificado, natureza jurídica e regras de validação. Em caso de dúvida, fale com nosso suporte antes de iniciar a emissão."
  },
  {
    id: "associacao",
    label: "Associação",
    title: "Associação",
    subtitle: "Documentos necessários",
    docs: [
      "Documento de identificação do representante legal",
      "CPF do representante",
      "Estatuto social e ata de eleição da diretoria",
      "Comprovante de inscrição no CNPJ"
    ],
    notes:
      "A documentação pode variar conforme o tipo de certificado, natureza jurídica e regras de validação. Em caso de dúvida, fale com nosso suporte antes de iniciar a emissão."
  },
  {
    id: "condominio",
    label: "Condomínio",
    title: "Condomínio",
    subtitle: "Documentos necessários",
    docs: [
      "Documento de identificação do síndico",
      "CPF do síndico",
      "Ata de eleição em vigor",
      "Convenção do condomínio, quando solicitada"
    ],
    notes:
      "A documentação pode variar conforme o tipo de certificado, natureza jurídica e regras de validação. Em caso de dúvida, fale com nosso suporte antes de iniciar a emissão."
  },
  {
    id: "rural",
    label: "Produtor Rural",
    title: "Produtor Rural",
    subtitle: "Documentos necessários",
    docs: [
      "Documento de identificação com foto",
      "CPF",
      "Inscrição estadual ou comprovação de atividade rural",
      "Documentos complementares conforme regras de validação"
    ],
    notes:
      "A documentação pode variar conforme o tipo de certificado, natureza jurídica e regras de validação. Em caso de dúvida, fale com nosso suporte antes de iniciar a emissão."
  },
  {
    id: "outros",
    label: "Outros",
    title: "Outros",
    subtitle: "Documentos necessários",
    docs: [
      "Documentos pessoais do responsável",
      "Documentos da entidade",
      "Comprovantes específicos conforme natureza jurídica",
      "Cada caso pode exigir documentação adicional"
    ],
    notes:
      "A documentação pode variar conforme o tipo de certificado, natureza jurídica e regras de validação. Em caso de dúvida, fale com nosso suporte antes de iniciar a emissão."
  }
];

export function FAQ() {
  const [activeDocCategory, setActiveDocCategory] = useState("pf");
  const activeDoc = docCategories.find((c) => c.id === activeDocCategory) ?? docCategories[0];

  return (
    <section id="duvidas" className="bg-slate-50/60 py-20 sm:py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Documentação</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Quais documentos são obrigatórios?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
            Confira as principais orientações antes de emitir seu Certificado Digital.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[220px_1fr]">
          <div
            role="tablist"
            aria-label="Categorias de documentação"
            aria-orientation="vertical"
            className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0"
          >
            {docCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                id={`doc-tab-${cat.id}`}
                aria-selected={activeDocCategory === cat.id}
                aria-controls={`doc-panel-${cat.id}`}
                onClick={() => setActiveDocCategory(cat.id)}
                className={`focus-ring shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all text-left whitespace-nowrap lg:whitespace-normal ${
                  activeDocCategory === cat.id
                    ? "border-ocean bg-ocean text-white shadow-soft"
                    : "border-slate-200 bg-white text-slate-700 hover:border-ocean/40 hover:text-ocean"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDocCategory}
              id={`doc-panel-${activeDocCategory}`}
              role="tabpanel"
              aria-labelledby={`doc-tab-${activeDocCategory}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8"
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-ocean">
                {activeDoc.subtitle}
              </p>
              <h3 className="mt-1 text-xl font-black text-ink sm:text-2xl">{activeDoc.title}</h3>

              <ul
                className="mt-6 space-y-3"
                aria-label={`Documentos para ${activeDoc.title}`}
              >
                {activeDoc.docs.map((doc) => (
                  <li key={doc} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ocean"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-6 text-slate-700">{doc}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl border border-lime-100 bg-lime-50/60 px-4 py-3 text-sm leading-6 text-slate-600">
                <strong className="font-black text-ocean">Atenção:</strong> {activeDoc.notes}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Ficou com dúvida sobre sua documentação específica?
                </p>
                <a
                  href="https://wa.me/5518991712107"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-full border border-ocean/30 bg-white px-4 py-2 text-sm font-extrabold text-ocean smooth-ease hover:bg-ocean hover:text-white"
                >
                  <MessageCircle size={15} aria-hidden="true" />
                  Falar com suporte
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
