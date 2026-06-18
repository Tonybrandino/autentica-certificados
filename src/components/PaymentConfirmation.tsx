"use client";

import type { CertificateProduct, ValidationMethod, ValidityStep } from "@/data/products";
import { products, validationMethods } from "@/data/products";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Home,
  Mail,
  MessageCircle,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type CertificateChoice = "pf" | "pj" | "nfe";
type DeviceChoice = "arquivo" | "smartcard" | "smartcard-leitora" | "token" | "nuvem";
type PaymentMethod = "card" | "pix" | "boleto";

const certificateOptions = [
  { id: "pf" as CertificateChoice, label: "Pessoa Física" },
  { id: "pj" as CertificateChoice, label: "Pessoa Jurídica" },
  { id: "nfe" as CertificateChoice, label: "NF-e" }
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

  return (
    <section className="relative bg-[linear-gradient(180deg,#f9fdf5_0%,#eef8e8_48%,#ffffff_100%)] pt-28 pb-16 sm:pb-20">
      <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-lime-200 to-transparent" aria-hidden="true" />
      <div className="section-shell">
        <div className="mx-auto max-w-5xl">
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
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-5xl">
                    Agora siga pelo e-mail e WhatsApp cadastrados
                  </h1>
                  <p className="mt-4 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
                    Enviamos as instruções dos próximos passos para os contatos informados no cadastro do certificado.
                    A validação e a conclusão do pedido continuam por lá.
                  </p>
                </div>

                <div className="rounded-3xl border border-lime-100 bg-white/85 p-4 shadow-sm lg:w-80">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Resumo</p>
                  <h2 className="mt-2 text-xl font-black text-ink">{selectedProduct?.name ?? "Certificado Digital"}</h2>
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

            <div className="grid gap-4 p-6 sm:p-8 lg:grid-cols-3 lg:p-10">
              <InstructionCard
                icon={Mail}
                title="Confira seu e-mail"
                text="Procure a mensagem com as orientações de validação, documentos e acesso ao atendimento."
              />
              <InstructionCard
                icon={MessageCircle}
                title="Acompanhe pelo WhatsApp"
                text="Nossa equipe também enviou o acompanhamento pelo WhatsApp cadastrado no pedido."
              />
              <InstructionCard
                icon={ClipboardCheck}
                title="Siga as instruções"
                text="Continue pelos canais enviados para concluir a validação e receber o certificado."
              />
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

function InstructionCard({ icon: Icon, title, text }: { icon: typeof Mail; title: string; text: string }) {
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
