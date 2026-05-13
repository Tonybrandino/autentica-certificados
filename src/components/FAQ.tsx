"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Qual certificado devo escolher?",
    answer:
      "Depende do uso. Pessoa física normalmente usa e-CPF; empresas usam e-CNPJ; emissão de notas pede NF-e. O assistente da home ajuda no primeiro direcionamento."
  },
  {
    question: "Qual a diferença entre A1 e A3?",
    answer:
      "O A1 é um arquivo digital com validade comum de 12 meses. O A3 usa token, cartão ou nuvem e costuma ter validade maior, com mais controle de uso."
  },
  {
    question: "Posso fazer por videoconferência?",
    answer:
      "Sim, quando o modelo escolhido e os requisitos de identificação permitirem. Caso contrário, o atendimento presencial pode ser indicado."
  },
  {
    question: "A renovação é automática?",
    answer:
      "A renovação online ou automática depende de elegibilidade. Se não for possível, o cliente segue para validação por videoconferência ou presencial."
  },
  {
    question: "Quanto tempo demora a emissão?",
    answer:
      "O prazo varia conforme pagamento, agenda de validação, conferência de documentos e regras da Autoridade Certificadora responsável."
  },
  {
    question: "O certificado tem validade jurídica?",
    answer:
      "Certificados emitidos conforme a ICP-Brasil podem ser usados para assinatura digital com validade jurídica, respeitando as regras aplicáveis ao uso."
  },
  {
    question: "Posso usar para emitir nota fiscal?",
    answer:
      "Sim. Para emissão de NF-e, normalmente são usados modelos NF-e ou e-CNPJ compatíveis com o sistema emissor."
  },
  {
    question: "O que acontece se meu certificado vencer?",
    answer:
      "Você pode perder acesso a sistemas, assinaturas e emissões até obter novo certificado. Por isso, é recomendado renovar antes do vencimento."
  },
  {
    question: "Preciso de token ou cartão?",
    answer:
      "Apenas em modelos A3 com mídia física. Modelos A1 usam arquivo digital e certificados em nuvem usam autenticação remota conforme a oferta."
  },
  {
    question: "O certificado em nuvem funciona como?",
    answer:
      "Permite uso remoto por autenticação em ambiente seguro, sem depender de token físico, conforme as condições do produto contratado."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="duvidas" className="bg-white py-20 sm:py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Dúvidas frequentes</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Respostas diretas para escolher com segurança
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-4xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-soft">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const buttonId = `faq-button-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <div key={faq.question}>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="focus-ring flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:items-center sm:px-5 sm:py-5"
                >
                  <span className="pr-1 text-sm font-black text-ink sm:text-base">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`mt-0.5 shrink-0 text-ocean transition sm:mt-0 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm leading-7 text-muted sm:px-5 sm:pb-5">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

