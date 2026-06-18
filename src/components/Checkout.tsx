"use client";

import type { CertificateProduct, ValidationMethod, ValidityStep } from "@/data/products";
import { products, validationMethods } from "@/data/products";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Barcode,
  CreditCard,
  ShieldCheck,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

type CertificateChoice = "pf" | "pj" | "nfe";
type DeviceChoice = "arquivo" | "smartcard" | "smartcard-leitora" | "token" | "nuvem";
type PaymentMethod = "card" | "pix" | "boleto";
type CheckoutStep = "details" | "payment";
type CertificateField = {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  wide?: boolean;
  inputMode?: "text" | "email" | "tel" | "numeric";
  maxLength?: number;
};

const ADDON_MONTHLY_PRICE = 9.9;
const pixCopyPaste =
  "00020126580014br.gov.bcb.pix0136checkout-okay-certificacao5204000053039865406123.455802BR5920OKAY CERTIFICACAO6009SAO PAULO62070503***6304A1B2";
const boletoLine = "34191.79001 01043.510047 91020.150008 7 98120000000000";

const certificateOptions = [
  { id: "pf" as CertificateChoice, label: "Pessoa Fisica" },
  { id: "pj" as CertificateChoice, label: "Pessoa Juridica" },
  { id: "nfe" as CertificateChoice, label: "NF-e" }
];

const deviceOptions = [
  { id: "arquivo" as DeviceChoice, label: "Arquivo A1", productType: "A1" as const, surcharge: 0 },
  { id: "smartcard" as DeviceChoice, label: "Cartão", productType: "A3" as const, surcharge: 70 },
  { id: "smartcard-leitora" as DeviceChoice, label: "Cartão + Leitora", productType: "A3" as const, surcharge: 120 },
  { id: "token" as DeviceChoice, label: "Token USB", productType: "A3" as const, surcharge: 90 },
  { id: "nuvem" as DeviceChoice, label: "Certificado em nuvem", productType: "Nuvem" as const, surcharge: 0 }
];

const paymentOptions = [
  { id: "card" as PaymentMethod, label: "Cartao", helper: "Aprovacao imediata", icon: CreditCard },
  { id: "pix" as PaymentMethod, label: "Pix", helper: "QR Code e copia e cola", icon: Banknote },
  { id: "boleto" as PaymentMethod, label: "Boleto", helper: "Abrir e imprimir PDF", icon: Barcode }
];

const certificateForms: Record<CertificateChoice, {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  fields: CertificateField[];
}> = {
  pf: {
    eyebrow: "Dados do titular",
    title: "Preencha os dados do e-CPF",
    description: "Use os dados do titular que fará a validação de identidade.",
    note: "Nome, CPF, data de nascimento e e-mail são a base do cadastro ICP-Brasil para pessoa física. RG e telefone ajudam nossa equipe na conferência.",
    fields: [
      { name: "fullName", label: "Nome completo", placeholder: "Nome como consta no CPF", required: true, wide: true },
      { name: "cpf", label: "CPF", placeholder: "000.000.000-00", required: true, inputMode: "numeric" },
      { name: "birthDate", label: "Data de nascimento", placeholder: "dd/mm/aaaa", required: true, type: "date" },
      { name: "email", label: "E-mail do titular", placeholder: "nome@email.com", required: true, type: "email", inputMode: "email" },
      { name: "phone", label: "Telefone/WhatsApp", placeholder: "(00) 00000-0000", required: true, inputMode: "tel" },
      { name: "rg", label: "RG ou CNH", placeholder: "Documento com foto", inputMode: "text" }
    ]
  },
  pj: {
    eyebrow: "Dados da empresa",
    title: "Preencha os dados do e-CNPJ",
    description: "Informe a empresa titular e o responsável legal perante o CNPJ.",
    note: "Para pessoa jurídica, o certificado cruza CNPJ válido com os dados do responsável legal. Cidade e UF ajudam a preparar o cadastro da emissão.",
    fields: [
      { name: "corporateName", label: "Razão social", placeholder: "Razão social da empresa", required: true, wide: true },
      { name: "cnpj", label: "CNPJ", placeholder: "00.000.000/0000-00", required: true, inputMode: "numeric" },
      { name: "companyCity", label: "Cidade da empresa", placeholder: "Cidade", required: true },
      { name: "companyState", label: "UF", placeholder: "UF", required: true, maxLength: 2 },
      { name: "responsibleName", label: "Nome do responsável", placeholder: "Responsável perante o CNPJ", required: true, wide: true },
      { name: "responsibleCpf", label: "CPF do responsável", placeholder: "000.000.000-00", required: true, inputMode: "numeric" },
      { name: "responsibleBirthDate", label: "Nascimento do responsável", placeholder: "dd/mm/aaaa", required: true, type: "date" },
      { name: "responsibleEmail", label: "E-mail do responsável", placeholder: "responsavel@email.com", required: true, type: "email", inputMode: "email" },
      { name: "responsiblePhone", label: "Telefone/WhatsApp", placeholder: "(00) 00000-0000", required: true, inputMode: "tel" }
    ]
  },
  nfe: {
    eyebrow: "Dados fiscais",
    title: "Preencha os dados para NF-e",
    description: "Informe os dados da empresa emissora e do responsável pela validação.",
    note: "NF-e usa certificado de pessoa jurídica para emissão fiscal. A inscrição estadual e o e-mail fiscal ajudam a direcionar a configuração depois da compra.",
    fields: [
      { name: "corporateName", label: "Razão social", placeholder: "Razão social da empresa", required: true, wide: true },
      { name: "cnpj", label: "CNPJ emissor", placeholder: "00.000.000/0000-00", required: true, inputMode: "numeric" },
      { name: "stateRegistration", label: "Inscrição estadual", placeholder: "Informe se houver", inputMode: "numeric" },
      { name: "companyCity", label: "Cidade", placeholder: "Cidade", required: true },
      { name: "companyState", label: "UF", placeholder: "UF", required: true, maxLength: 2 },
      { name: "fiscalEmail", label: "E-mail fiscal", placeholder: "fiscal@empresa.com.br", required: true, type: "email", inputMode: "email", wide: true },
      { name: "responsibleName", label: "Responsável pela validação", placeholder: "Nome completo", required: true, wide: true },
      { name: "responsibleCpf", label: "CPF do responsável", placeholder: "000.000.000-00", required: true, inputMode: "numeric" },
      { name: "responsibleBirthDate", label: "Nascimento do responsável", placeholder: "dd/mm/aaaa", required: true, type: "date" },
      { name: "responsiblePhone", label: "Telefone/WhatsApp", placeholder: "(00) 00000-0000", required: true, inputMode: "tel" }
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

export function Checkout() {
  const router = useRouter();
  const params = useSearchParams();
  const certificateParam = params.get("certificate");
  const deviceParam = params.get("device");
  const validationParam = params.get("validation");

  const certificate = isCertificateChoice(certificateParam) ? certificateParam : "pf";
  const device = isDeviceChoice(deviceParam) ? deviceParam : "arquivo";
  const validation = isValidationMethod(validationParam) ? validationParam : "video";
  const requestedValidity = parseValidity(params.get("validity"));

  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("details");
  const [certificateData, setCertificateData] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [includeAddon, setIncludeAddon] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  const selectedProduct = useMemo(() => getProduct(certificate, device), [certificate, device]);
  const selectedDevice = deviceOptions.find(option => option.id === device) ?? deviceOptions[0];
  const selectedCertificate = certificateOptions.find(option => option.id === certificate) ?? certificateOptions[0];
  const selectedValidation = validationMethods.find(method => method.id === validation) ?? validationMethods[0];
  const certificateForm = certificateForms[certificate];
  const validities = selectedProduct ? getAvailableValidities(selectedProduct) : [];
  const activeValidity = validities.includes(requestedValidity) ? requestedValidity : validities[0] ?? 12;
  const basePrice = selectedProduct?.pricesByValidity[activeValidity] ?? 0;
  const surcharge = selectedDevice.productType === "A3" ? selectedDevice.surcharge : 0;
  const certificateTotal = basePrice + surcharge;
  const firstCharge = certificateTotal + (includeAddon ? ADDON_MONTHLY_PRICE : 0);
  function updateCertificateData(name: string, value: string) {
    setCertificateData(current => ({ ...current, [name]: value }));
  }

  function submitCertificateData(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutStep("payment");
  }

  function fillFakeCard() {
    setCardData({
      number: "4111 1111 1111 1111",
      name: "Cliente Okay",
      expiry: "12/30",
      cvv: "123"
    });
  }

  function copyPix() {
    void navigator.clipboard?.writeText(pixCopyPaste);
    setCopiedPix(true);
  }

  function pay() {
    const confirmationParams = new URLSearchParams({
      validation,
      certificate,
      device,
      validity: String(activeValidity),
      payment: paymentMethod
    });

    if (includeAddon) {
      confirmationParams.set("addon", "saude");
    }

    router.push(`/confirmacao?${confirmationParams.toString()}`);
  }

  return (
    <section className="relative bg-[linear-gradient(180deg,#f9fdf5_0%,#eef8e8_48%,#ffffff_100%)] pt-28 pb-16 sm:pb-20">
      <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-lime-200 to-transparent" aria-hidden="true" />
      <div className="section-shell">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Link
              href="/#certificados"
              className="focus-ring inline-flex items-center gap-2 rounded-full text-sm font-extrabold text-ocean hover:text-trust"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar para configuracao
            </Link>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.2em] text-ocean">
              {checkoutStep === "details" ? "Dados do certificado" : "Checkout"}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">
              {checkoutStep === "details" ? "Informe os dados para emissao" : "Finalize seu certificado digital"}
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-500">
              {checkoutStep === "details"
                ? "Antes do pagamento, confira os dados que serao usados para preparar a validacao do certificado."
                : "Escolha a forma de pagamento, revise o pedido e acompanhe a preparacao apos a confirmacao."}
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-lime-100 bg-white px-4 py-2 text-sm font-extrabold text-ocean shadow-sm">
            <ShoppingCart size={17} aria-hidden="true" />
            Resumo de compra
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-3xl border border-lime-100 bg-white p-5 shadow-lift sm:p-7">
            {checkoutStep === "details" ? (
              <form onSubmit={submitCertificateData}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                      {certificateForm.eyebrow}
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-ink">{certificateForm.title}</h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                      {certificateForm.description}
                    </p>
                  </div>
                  <ShieldCheck className="shrink-0 text-ocean" size={22} aria-hidden="true" />
                </div>

                <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {certificateForm.fields.map(field => (
                      <label
                        key={field.name}
                        className={`text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500 ${
                          field.wide ? "sm:col-span-2" : ""
                        }`}
                      >
                        {field.label}
                        {field.required && <span className="text-trust"> *</span>}
                        <input
                          type={field.type ?? "text"}
                          value={certificateData[field.name] ?? ""}
                          onChange={event => updateCertificateData(field.name, event.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          inputMode={field.inputMode}
                          maxLength={field.maxLength}
                          className="focus-ring mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-700 placeholder:text-slate-300"
                        />
                      </label>
                    ))}
                  </div>

                  <p className="mt-5 rounded-2xl border border-lime-100 bg-white p-4 text-sm font-semibold leading-6 text-slate-600">
                    {certificateForm.note}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/#certificados"
                    className="focus-ring inline-flex min-h-12 items-center justify-center rounded-2xl border border-lime-100 bg-white px-5 text-sm font-black text-ocean hover:bg-lime-50"
                  >
                    Voltar para configuracao
                  </Link>
                  <button
                    type="submit"
                    className="focus-ring inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-trust px-5 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_35px_rgba(92,175,24,0.24)] hover:bg-[#4e9f16]"
                  >
                    Continuar para pagamento
                  </button>
                </div>
              </form>
            ) : (
              <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Forma de pagamento
                </p>
                <h2 className="mt-1 text-2xl font-black text-ink">Como prefere pagar?</h2>
              </div>
              <ShieldCheck className="text-ocean" size={22} aria-hidden="true" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {paymentOptions.map(option => {
                const Icon = option.icon;
                const active = paymentMethod === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id)}
                    className={`focus-ring rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-ocean bg-lime-50 shadow-[0_14px_30px_rgba(63,127,18,0.14)]"
                        : "border-slate-200 bg-white hover:border-lime-200 hover:bg-lime-50/40"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        active ? "bg-ocean text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="mt-3 block text-sm font-black text-slate-800">{option.label}</span>
                    <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{option.helper}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
              {paymentMethod === "card" && (
                <div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                      Numero do cartao
                      <input
                        value={cardData.number}
                        onChange={event => setCardData({ ...cardData, number: event.target.value })}
                        placeholder="0000 0000 0000 0000"
                        className="focus-ring mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-700"
                      />
                    </label>
                    <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                      Nome impresso
                      <input
                        value={cardData.name}
                        onChange={event => setCardData({ ...cardData, name: event.target.value })}
                        placeholder="Nome completo"
                        className="focus-ring mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-700"
                      />
                    </label>
                    <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                      Validade
                      <input
                        value={cardData.expiry}
                        onChange={event => setCardData({ ...cardData, expiry: event.target.value })}
                        placeholder="MM/AA"
                        className="focus-ring mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-700"
                      />
                    </label>
                    <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                      CVV
                      <input
                        value={cardData.cvv}
                        onChange={event => setCardData({ ...cardData, cvv: event.target.value })}
                        placeholder="123"
                        className="focus-ring mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-700"
                      />
                    </label>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={fillFakeCard}
                      className="focus-ring inline-flex min-h-12 items-center justify-center rounded-2xl border border-lime-100 bg-white px-5 text-sm font-black text-ocean hover:bg-lime-50"
                    >
                      Preencher cartao teste
                    </button>
                    <button
                      type="button"
                      onClick={pay}
                      className="focus-ring inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-trust px-5 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_35px_rgba(92,175,24,0.24)] hover:bg-[#4e9f16]"
                    >
                      Pagar {formatCurrency(firstCharge)}
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === "pix" && (
                <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
                  <div className="grid aspect-square place-items-center rounded-3xl border border-lime-200 bg-white p-4">
                    <div className="grid h-full w-full grid-cols-5 gap-1">
                      {Array.from({ length: 25 }).map((_, index) => (
                        <span
                          key={index}
                          className={`rounded-sm ${[0, 1, 3, 5, 6, 9, 10, 12, 14, 16, 18, 19, 21, 23, 24].includes(index) ? "bg-ocean" : "bg-lime-100"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-ink">Pix copia e cola</p>
                    <textarea
                      readOnly
                      value={pixCopyPaste}
                      rows={4}
                      className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-xs font-semibold leading-5 text-slate-600"
                    />
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={copyPix}
                        className="focus-ring inline-flex min-h-12 items-center justify-center rounded-2xl border border-lime-100 bg-white px-5 text-sm font-black text-ocean hover:bg-lime-50"
                      >
                        {copiedPix ? "Codigo copiado" : "Copiar codigo Pix"}
                      </button>
                      <button
                        type="button"
                        onClick={pay}
                        className="focus-ring inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-trust px-5 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-[#4e9f16]"
                      >
                        Simular Pix pago
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "boleto" && (
                <div>
                  <p className="text-sm font-black text-ink">Linha digitavel</p>
                  <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-black text-slate-700">
                    {boletoLine}
                  </div>
                  <div className="mt-4 flex h-20 items-end gap-1 rounded-2xl border border-slate-200 bg-white p-4">
                    {Array.from({ length: 34 }).map((_, index) => (
                      <span
                        key={index}
                        className="w-1.5 bg-slate-900"
                        style={{ height: `${28 + ((index * 17) % 42)}px` }}
                      />
                    ))}
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="focus-ring inline-flex min-h-12 items-center justify-center rounded-2xl border border-lime-100 bg-white px-5 text-sm font-black text-ocean hover:bg-lime-50"
                    >
                      Abrir e imprimir PDF
                    </button>
                    <button
                      type="button"
                      onClick={pay}
                      className="focus-ring inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-trust px-5 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-[#4e9f16]"
                    >
                      Simular boleto pago
                    </button>
                  </div>
                </div>
              )}
            </div>
              </>
            )}
          </div>

          <aside className="h-fit rounded-3xl border border-lime-100 bg-white p-5 shadow-lift lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                Resumo
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-lime-50 px-2.5 py-1 text-[10px] font-extrabold text-ocean">
                <BadgeCheck size={12} aria-hidden="true" />
                ICP-Brasil
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <h2 className="text-xl font-black text-ink">{selectedProduct?.name ?? "Certificado Digital"}</h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                {selectedCertificate.label} com {selectedDevice.label} e validacao por {selectedValidation.title}.
              </p>
            </div>

            <div className="mt-3 space-y-2 rounded-2xl border border-slate-100 bg-white p-4">
              <SummaryRow label="Certificado" value={formatCurrency(basePrice)} />
              <SummaryRow label="Dispositivo" value={surcharge > 0 ? formatCurrency(surcharge) : "Incluso"} />
              <SummaryRow label="Validade" value={`${activeValidity} meses`} />
              <SummaryRow label="Dados" value={checkoutStep === "details" ? "Pendente" : "Preenchidos"} />
            </div>

            <label
              className={`mt-4 block cursor-pointer rounded-3xl border-2 p-4 shadow-[0_18px_38px_rgba(92,175,24,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(92,175,24,0.24)] ${
                includeAddon
                  ? "border-trust bg-[linear-gradient(135deg,rgba(126,208,56,0.28),rgba(255,255,255,0.96))]"
                  : "border-lime-300 bg-[linear-gradient(135deg,rgba(126,208,56,0.2),rgba(255,255,255,0.94))]"
              }`}
            >
              <span className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={includeAddon}
                  onChange={event => setIncludeAddon(event.target.checked)}
                  className="mt-1 h-6 w-6 shrink-0 accent-[#7ed038]"
                />
                <span className="min-w-0 flex-1">
                  <span className="inline-flex whitespace-nowrap rounded-full bg-trust px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">
                    Produto adicional
                  </span>
                  <span className="mt-3 block text-xl font-black leading-tight text-ink">Saude do seu negocio</span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-slate-600">
                    Monitoramento mensal para acompanhar a reputacao e riscos do CNPJ.
                  </span>
                  <span className="mt-3 inline-flex rounded-full border border-lime-200 bg-white px-3 py-1.5 text-sm font-black text-trust shadow-sm">
                    + {formatCurrency(ADDON_MONTHLY_PRICE)}/mes
                  </span>
                </span>
                <span className={`mt-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                  includeAddon ? "bg-trust text-white" : "bg-white text-trust"
                }`}>
                  {includeAddon ? "Selecionado" : "Adicionar"}
                </span>
              </span>
            </label>

            <div className="mt-4 rounded-3xl bg-ink p-4 text-white">
              <SummaryRowDark label="Certificado" value={formatCurrency(certificateTotal)} />
              {includeAddon && <SummaryRowDark label="Adicional mensal" value={formatCurrency(ADDON_MONTHLY_PRICE)} />}
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/50">Total inicial</p>
                <p className="mt-1 text-3xl font-black">{formatCurrency(firstCharge)}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
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

function SummaryRowDark({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-center justify-between gap-3 text-sm">
      <span className="font-semibold text-white/60">{label}</span>
      <span className="text-right font-black text-white">{value}</span>
    </p>
  );
}
