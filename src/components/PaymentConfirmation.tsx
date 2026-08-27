"use client";

import { SchedulingPanel } from "@/components/scheduling/SchedulingPanel";
import { useOrderDraft } from "@/components/scheduling/useOrderDraft";
import type { CertificateProduct, ValidationMethod, ValidityStep } from "@/data/products";
import { products, validationMethods } from "@/data/products";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  FileCheck2,
  Home,
  KeyRound,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type CertificateChoice = "pf" | "pj" | "nfe";
type DeviceChoice = "arquivo" | "smartcard" | "smartcard-leitora" | "token" | "nuvem";
type PaymentMethod = "card" | "pix" | "boleto";

const certificateOptions = [
  { id: "pf" as CertificateChoice, label: "Pessoa Física", code: "CPF" },
  { id: "pj" as CertificateChoice, label: "Pessoa Jurídica", code: "CNPJ" },
  { id: "nfe" as CertificateChoice, label: "NF-e", code: "NF-e" }
];

const deviceOptions = [
  { id: "arquivo" as DeviceChoice, label: "Arquivo A1", productType: "A1" as const, surcharge: 0 },
  { id: "smartcard" as DeviceChoice, label: "Cartão", productType: "A3" as const, surcharge: 70 },
  { id: "smartcard-leitora" as DeviceChoice, label: "Cartão + Leitora", productType: "A3" as const, surcharge: 120 },
  { id: "token" as DeviceChoice, label: "Token USB", productType: "A3" as const, surcharge: 90 },
  { id: "nuvem" as DeviceChoice, label: "Certificado em nuvem", productType: "Nuvem" as const, surcharge: 0 }
];

const paymentLabels: Record<PaymentMethod, string> = {
  card: "Cartão",
  pix: "Pix",
  boleto: "Boleto"
};

type ConfirmationCopy = {
  title: string;
  description: string;
  nextStep: string;
  cards: Array<{ icon: LucideIcon; title: string; text: string }>;
};

const confirmationCopy: Record<ValidationMethod, ConfirmationCopy> = {
  video: {
    title: "Pagamento confirmado. Agora agende sua videoconferência",
    description:
      "A senha do certificado já foi criada no checkout. Falta apenas escolher a data e o horário da validação de identidade por vídeo.",
    nextStep: "Agendar videoconferência",
    cards: [
      {
        icon: CalendarClock,
        title: "Escolha data e horário",
        text: "A agenda abaixo mostra os horários livres com validação online em tempo real."
      },
      {
        icon: KeyRound,
        title: "Senha já definida",
        text: "Guarde a senha criada no checkout: ela será usada na emissão e não pode ser recuperada."
      },
      {
        icon: Mail,
        title: "Link por e-mail e WhatsApp",
        text: "Depois de agendar, enviamos o link da sala e o passo a passo para os contatos do pedido."
      }
    ]
  },
  presencial: {
    title: "Pagamento confirmado. Agora agende seu atendimento presencial",
    description:
      "Escolha o posto de atendimento, a data e o horário da validação de identidade para concluir a emissão do certificado.",
    nextStep: "Agendar atendimento presencial",
    cards: [
      {
        icon: MapPin,
        title: "Escolha o posto",
        text: "Selecione a unidade mais próxima e confira o endereço completo antes de confirmar."
      },
      {
        icon: FileCheck2,
        title: "Leve os originais",
        text: "Leve os documentos originais com foto no dia do atendimento no posto escolhido."
      },
      {
        icon: Mail,
        title: "Comprovante por e-mail",
        text: "Você recebe o comprovante do agendamento e as orientações nos contatos do pedido."
      }
    ]
  },
  renovacao: {
    title: "Pagamento confirmado. Emissão automática liberada",
    description:
      "Sua emissão não precisa de agendamento: ela é concluída no ambiente da autoridade certificadora com o certificado anterior ainda válido.",
    nextStep: "Ir para a emissão online",
    cards: [
      {
        icon: Zap,
        title: "Sem agendamento",
        text: "A validação é feita na hora, direto no ambiente de emissão online."
      },
      {
        icon: ShieldCheck,
        title: "Validação pelo certificado atual",
        text: "Tenha em mãos o certificado anterior válido e a senha dele para autenticar."
      },
      {
        icon: MessageCircle,
        title: "Suporte no WhatsApp",
        text: "Se algo falhar na emissão, nossa equipe acompanha pelo WhatsApp cadastrado."
      }
    ]
  }
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function getAvailableValidities(product: CertificateProduct) {
  return Object.keys(product.pricesByValidity).map(Number).sort((a, b) => a - b) as ValidityStep[];
}

function isCertificateChoice(value: string | null): value is CertificateChoice {
  return value === "pf" || value === "pj" || value === "nfe";
}

function isDeviceChoice(value: string | null): value is DeviceChoice {
  return value === "arquivo" || value === "smartcard" || value === "smartcard-leitora" || value === "token" || value === "nuvem";
}

function isValidationMethod(value: string | null): value is ValidationMethod {
  return value === "video" || value === "presencial" || value === "renovacao";
}

function isPaymentMethod(value: string | null): value is PaymentMethod {
  return value === "card" || value === "pix" || value === "boleto";
}

function parseValidity(value: string | null): ValidityStep {
  const parsed = Number(value);
  return [12, 24, 36, 48, 60].includes(parsed) ? (parsed as ValidityStep) : 12;
}

function getProduct(certificate: CertificateChoice, device: DeviceChoice) {
  if (certificate === "nfe") return products.find(p => p.id === "nfe") ?? null;
  const dev = deviceOptions.find(o => o.id === device) ?? deviceOptions[0];
  const profile = certificate === "pf" ? "pf" : "pj";
  return (
    products.find(p => p.profile === profile && p.type === dev.productType) ??
    products.find(p => p.profile === profile) ??
    null
  );
}

export function PaymentConfirmation() {
  const params = useSearchParams();
  const certificateParam = params.get("certificate");
  const deviceParam = params.get("device");
  const validationParam = params.get("validation");
  const paymentParam = params.get("payment");
  const certificate = isCertificateChoice(certificateParam) ? certificateParam : "pf";
  const device = isDeviceChoice(deviceParam) ? deviceParam : "arquivo";
  const validation = isValidationMethod(validationParam) ? validationParam : "video";
  const payment = isPaymentMethod(paymentParam) ? paymentParam : "card";
  const requestedValidity = parseValidity(params.get("validity"));
  const includeAddon = params.get("addon") === "saude";

  const selectedProduct = getProduct(certificate, device);
  const selectedDevice = deviceOptions.find(option => option.id === device) ?? deviceOptions[0];
  const selectedCertificate = certificateOptions.find(option => option.id === certificate) ?? certificateOptions[0];
  const selectedValidation = validationMethods.find(method => method.id === validation) ?? validationMethods[0];
  const validities = selectedProduct ? getAvailableValidities(selectedProduct) : [];
  const activeValidity = validities.includes(requestedValidity) ? requestedValidity : validities[0] ?? 12;
  const basePrice = selectedProduct?.pricesByValidity[activeValidity] ?? 0;
  const surcharge = selectedDevice.productType === "A3" ? selectedDevice.surcharge : 0;
  const certificateTotal = basePrice + surcharge;
  const firstCharge = certificateTotal + (includeAddon ? 9.9 : 0);
  const copy = confirmationCopy[validation];
  const productCode = `${selectedCertificate.code} ${selectedDevice.productType}`;
  const productName = selectedProduct?.name ?? "Certificado Digital";
  const seed = `${certificate}-${device}-${validation}-${activeValidity}-${payment}`;
  const { order, hasDraft } = useOrderDraft({ validation, productName, productCode, seed });

  return (
    <section className="relative bg-[linear-gradient(180deg,#f9fdf5_0%,#eef8e8_48%,#ffffff_100%)] pt-28 pb-16 sm:pb-20">
      <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-lime-200 to-transparent" aria-hidden="true" />
      <div className="section-shell">
        <div className="mx-auto max-w-5xl space-y-5">
          <div className="overflow-hidden rounded-3xl border-2 border-lime-200 bg-white shadow-[0_24px_70px_rgba(63,127,18,0.14)]">
            <div className="bg-[linear-gradient(135deg,rgba(126,208,56,0.28),rgba(255,255,255,0.96))] p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-trust text-white shadow-[0_18px_35px_rgba(92,175,24,0.26)]">
                    <CheckCircle2 size={30} strokeWidth={2.6} aria-hidden="true" />
                  </span>
                  <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-ocean">
                    Pagamento confirmado
                  </p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-5xl">{copy.title}</h1>
                  <p className="mt-4 text-base font-semibold leading-7 text-slate-600 sm:text-lg">{copy.description}</p>
                  <a
                    href="#agendamento"
                    className="focus-ring mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-ink px-5 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-slate-800"
                  >
                    {copy.nextStep}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>

                <div className="rounded-3xl border border-lime-100 bg-white/85 p-4 shadow-sm lg:w-80">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Resumo</p>
                  <h2 className="mt-2 text-xl font-black text-ink">{productName}</h2>
                  {hasDraft && (
                    <p className="mt-1 text-sm font-bold leading-5 text-slate-600">{order.holderName}</p>
                  )}
                  <div className="mt-4 space-y-2">
                    <SummaryRow label="Certificado" value={selectedCertificate.label} />
                    <SummaryRow label="Dispositivo" value={selectedDevice.label} />
                    <SummaryRow label="Validade" value={`${activeValidity} meses`} />
                    <SummaryRow label="Validação" value={selectedValidation.title} />
                    <SummaryRow label="Pagamento" value={paymentLabels[payment]} />
                  </div>
                  <div className="mt-4 rounded-2xl bg-ink p-4 text-white">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/50">Total inicial</p>
                    <p className="mt-1 text-3xl font-black">{formatCurrency(firstCharge)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="agendamento" className="scroll-mt-28">
            <SchedulingPanel
              validation={validation}
              productName={productName}
              productCode={productCode}
              seed={seed}
            />
          </div>

          <div className="overflow-hidden rounded-3xl border border-lime-100 bg-white shadow-[0_24px_70px_rgba(63,127,18,0.1)]">
            <div className="grid gap-4 p-6 sm:p-8 lg:grid-cols-3">
              {copy.cards.map(card => (
                <InstructionCard key={card.title} icon={card.icon} title={card.title} text={card.text} />
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-lime-100 bg-slate-50/70 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-lime-50 px-3 py-2 text-xs font-extrabold text-ocean">
                <ShieldCheck size={15} aria-hidden="true" />
                Pedido protegido por fluxo ICP-Brasil
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-lime-100 bg-white px-5 text-sm font-black text-ocean hover:bg-lime-50"
                >
                  <Home size={16} aria-hidden="true" />
                  Início
                </Link>
                <Link
                  href="/#certificados"
                  className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-trust px-5 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_35px_rgba(92,175,24,0.24)] hover:bg-[#4e9f16]"
                >
                  Novo pedido
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstructionCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-lime-100 bg-white p-5 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-50 text-trust">
        <Icon size={21} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-black text-ink">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-center justify-between gap-3 text-sm">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-right font-black text-slate-800">{value}</span>
    </p>
  );
}
