export type CustomerProfile = "pf" | "pj";

export type CertificateType = "A1" | "A3" | "Nuvem" | "A1/A3";

export type CertificateProduct = {
  id: string;
  name: string;
  profile: CustomerProfile;
  audience: string;
  type: CertificateType;
  storage: string;
  description: string;
  benefits: string[];
  badge: string;
  pricePlaceholder: string;
  validityOptions: string[];
};

export type ValidationMethod = "video" | "presencial" | "renovacao";

export const validationMethods: Array<{
  id: ValidationMethod;
  title: string;
  subtitle: string;
}> = [
  {
    id: "video",
    title: "Videoconferência",
    subtitle: "Atendimento online com validação de identidade."
  },
  {
    id: "presencial",
    title: "Presencial",
    subtitle: "Atendimento em ponto físico com suporte assistido."
  },
  {
    id: "renovacao",
    title: "Renovação automática",
    subtitle: "Para titulares elegíveis com processo digital simplificado."
  }
];

export const products: CertificateProduct[] = [
  {
    id: "ecpf-a1",
    name: "e-CPF A1",
    profile: "pf",
    audience: "Pessoa física",
    type: "A1",
    storage: "Arquivo digital",
    description: "Modelo prático para assinatura digital e acesso a serviços do governo.",
    benefits: [
      "Validade de 12 meses para uso recorrente",
      "Instalação rápida sem token físico",
      "Compatível com e-CAC, gov.br e assinatura digital"
    ],
    badge: "Mais buscado PF",
    pricePlaceholder: "A partir de R$ 149",
    validityOptions: ["12 meses"]
  },
  {
    id: "ecpf-a3",
    name: "e-CPF A3",
    profile: "pf",
    audience: "Pessoa física",
    type: "A3",
    storage: "Token ou cartão",
    description: "Modelo com chave em hardware para quem quer mais controle de uso.",
    benefits: [
      "Senha e controle de acesso por dispositivo físico",
      "Opções de 12, 24 e 36 meses",
      "Bom para rotina profissional e assinaturas frequentes"
    ],
    badge: "Segurança reforçada",
    pricePlaceholder: "A partir de R$ 239",
    validityOptions: ["12 meses", "24 meses", "36 meses"]
  },
  {
    id: "ecpf-nuvem",
    name: "Certificado em Nuvem PF",
    profile: "pf",
    audience: "Pessoa física",
    type: "Nuvem",
    storage: "HSM remoto com autenticação por app",
    description: "Assine de diferentes dispositivos sem depender de token físico.",
    benefits: [
      "Uso remoto em computador e celular",
      "Autenticação forte por app",
      "Mobilidade com segurança jurídica"
    ],
    badge: "Mobilidade total",
    pricePlaceholder: "A partir de R$ 269",
    validityOptions: ["12 meses", "24 meses", "36 meses", "60 meses"]
  },
  {
    id: "ecnpj-a1",
    name: "e-CNPJ A1",
    profile: "pj",
    audience: "Pessoa jurídica",
    type: "A1",
    storage: "Arquivo digital",
    description: "Modelo para operação fiscal e administrativa digital da empresa.",
    benefits: [
      "Integração com sistemas fiscais e contábeis",
      "Validade de 12 meses",
      "Boa opção para uso contínuo em equipe"
    ],
    badge: "Mais vendido PJ",
    pricePlaceholder: "A partir de R$ 199",
    validityOptions: ["12 meses"]
  },
  {
    id: "ecnpj-a3",
    name: "e-CNPJ A3",
    profile: "pj",
    audience: "Pessoa jurídica",
    type: "A3",
    storage: "Token ou cartão",
    description: "Modelo corporativo com controle de credencial por mídia física.",
    benefits: [
      "Camada extra de segurança para uso empresarial",
      "Validades de 12, 24 e 36 meses",
      "Indicado para processos com controle de responsável"
    ],
    badge: "Governança de uso",
    pricePlaceholder: "A partir de R$ 259",
    validityOptions: ["12 meses", "24 meses", "36 meses"]
  },
  {
    id: "ecnpj-nuvem",
    name: "e-CNPJ em Nuvem",
    profile: "pj",
    audience: "Pessoa jurídica",
    type: "Nuvem",
    storage: "HSM remoto com autenticação",
    description: "Uso empresarial remoto sem dependência de token físico.",
    benefits: [
      "Acesso em múltiplos dispositivos autorizados",
      "Fluxo ágil para equipes distribuídas",
      "Segurança com autenticação de acesso"
    ],
    badge: "Empresa remota",
    pricePlaceholder: "A partir de R$ 289",
    validityOptions: ["12 meses", "24 meses", "36 meses", "60 meses"]
  },
  {
    id: "nfe",
    name: "NF-e",
    profile: "pj",
    audience: "Empresas emissoras de nota fiscal eletrônica",
    type: "A1/A3",
    storage: "Arquivo digital ou token/cartão",
    description: "Certificado para emissão de NF-e com opções para automação ou controle.",
    benefits: [
      "Escolha entre modelo A1 ou A3 conforme operação",
      "Compatível com emissores e ERPs fiscais",
      "Atende rotina de emissão recorrente com segurança"
    ],
    badge: "Foco fiscal",
    pricePlaceholder: "A partir de R$ 219",
    validityOptions: ["12 meses", "24 meses", "36 meses"]
  }
];

