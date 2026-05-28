"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
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

type DocCategory = {
  id: string;
  label: string;
  docs: string[];
  notes: string;
};

const docCategories: DocCategory[] = [
  {
    id: "pf",
    label: "Pessoa Física",
    docs: [
      "Documento de identidade com foto (RG, CNH ou passaporte)",
      "CPF (pode constar no documento de identidade)",
      "Comprovante de residência atualizado (últimos 3 meses)",
    ],
    notes:
      "Os documentos devem estar legíveis e dentro da validade. Exigências específicas podem variar conforme o tipo de certificado e a Autoridade Certificadora."
  },
  {
    id: "pj",
    label: "Pessoa Jurídica",
    docs: [
      "CNPJ ativo",
      "Contrato social ou estatuto atualizado",
      "Documento de identidade com foto do responsável legal (RG ou CNH)",
      "CPF do responsável legal",
      "Comprovante de endereço da empresa",
    ],
    notes:
      "O responsável legal deve estar presente ou representado por procuração conforme a AC responsável. Confirme os documentos antes do atendimento."
  },
  {
    id: "mei",
    label: "MEI",
    docs: [
      "Certificado MEI (CCMEI) com CNPJ ativo",
      "Documento de identidade com foto do titular (RG ou CNH)",
      "CPF do titular",
      "Comprovante de endereço",
    ],
    notes:
      "O MEI deve constar ativo na Receita Federal. Em caso de dúvida, confirme os requisitos diretamente com o atendimento."
  },
  {
    id: "ltda",
    label: "Empresa LTDA",
    docs: [
      "Contrato social atualizado e registrado em cartório ou Junta Comercial",
      "CNPJ ativo",
      "Documento de identidade e CPF dos sócios administradores",
      "Comprovante de endereço da empresa",
      "Ata da última alteração contratual, se houver",
    ],
    notes:
      "Se houver múltiplos sócios administradores, documentar conforme o contrato social vigente. Verifique com o atendimento caso exista procuração."
  },
  {
    id: "associacao",
    label: "Associação",
    docs: [
      "Estatuto social registrado",
      "Ata de eleição da diretoria atual registrada em cartório",
      "CNPJ ativo",
      "Documento de identidade e CPF do representante legal",
      "Comprovante de endereço da sede",
    ],
    notes:
      "O mandato do representante deve estar vigente. Verifique a documentação com o atendimento antes da emissão."
  },
  {
    id: "condominio",
    label: "Condomínio",
    docs: [
      "Convenção do condomínio registrada em cartório",
      "Ata de eleição do síndico atual registrada em cartório",
      "CNPJ do condomínio",
      "Documento de identidade e CPF do síndico",
      "Comprovante de endereço do condomínio",
    ],
    notes:
      "O síndico deve estar em mandato vigente e com a documentação em dia. Confirme os requisitos com o atendimento."
  },
  {
    id: "rural",
    label: "Produtor Rural",
    docs: [
      "Documento de identidade com foto (RG ou CNH)",
      "CPF",
      "Inscrição estadual como produtor rural",
      "Comprovante de endereço ou propriedade rural",
    ],
    notes:
      "A documentação pode variar conforme o estado e o tipo de operação. Consulte o atendimento para orientação personalizada."
  },
  {
    id: "outros",
    label: "Outros",
    docs: [
      "Documentação varia conforme o tipo de entidade",
      "Documento de identidade do responsável legal",
      "Comprovação do vínculo com a entidade (estatuto, ata ou contrato)",
      "CNPJ ou identificação fiscal, quando aplicável",
    ],
    notes:
      "Para entidades não listadas, entre em contato com o suporte para orientação personalizada antes do atendimento."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeDocCategory, setActiveDocCategory] = useState("pf");

  const activeDoc = docCategories.find((c) => c.id === activeDocCategory) ?? docCategories[0];

  return (
    <section id="duvidas" className="bg-white py-20 sm:py-24">
      <div className="section-shell">
        {/* Perguntas frequentes */}
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

        {/* Documentos necessários por categoria */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Documentação</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Quais documentos são obrigatórios?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted">
              Selecione o tipo de entidade e veja a documentação necessária para emissão do certificado digital.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Categorias de documentação">
            {docCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeDocCategory === cat.id}
                aria-controls={`doc-panel-${cat.id}`}
                onClick={() => setActiveDocCategory(cat.id)}
                className={`focus-ring rounded-full border px-4 py-2 text-sm font-bold transition ${
                  activeDocCategory === cat.id
                    ? "border-ocean bg-ocean text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-ocean/50 hover:text-ocean"
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6"
            >
              <h3 className="text-base font-black text-ink sm:text-lg">
                {activeDoc.label} — documentos necessários
              </h3>

              <ul className="mt-4 divide-y divide-slate-100" aria-label={`Documentos para ${activeDoc.label}`}>
                {activeDoc.docs.map((doc) => (
                  <li key={doc} className="flex items-start gap-3 py-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ocean" aria-hidden="true" />
                    <span className="text-sm leading-6 text-slate-700">{doc}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm leading-6 text-slate-600">
                <strong className="font-black text-ocean">Atenção:</strong> {activeDoc.notes}
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Ficou com dúvida sobre sua documentação específica?
                </p>
                <a
                  href="#fale-conosco"
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-ocean/30 bg-white px-4 py-2 text-sm font-extrabold text-ocean smooth-ease hover:bg-ocean hover:text-white"
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
