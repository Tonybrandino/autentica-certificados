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
import { useEffect, useMemo, useState } from "react";

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
  minLength?: number;
  helper?: string;
  accept?: string;
};

const ADDON_MONTHLY_PRICE = 9.9;
const pixCopyPaste =
  "00020126580014br.gov.bcb.pix0136checkout-okay-certificacao5204000053039865406123.455802BR5920OKAY CERTIFICACAO6009SAO PAULO62070503***6304A1B2";
const boletoLine = "34191.79001 01043.510047 91020.150008 7 98120000000000";

const identityField: CertificateField = {
  name: "document",
  label: "CPF ou CNPJ",
  placeholder: "Digite o CPF ou CNPJ",
  required: true,
  inputMode: "numeric",
  wide: true
};

const addressFields: CertificateField[] = [
  { name: "zipCode", label: "CEP", placeholder: "00000-000", required: true, inputMode: "numeric" },
  { name: "street", label: "Endereço", placeholder: "Preenchido pelo CEP", required: true },
  { name: "number", label: "Número", placeholder: "Número", required: true },
  { name: "complement", label: "Complemento", placeholder: "Opcional" },
  { name: "district", label: "Bairro", placeholder: "Preenchido pelo CEP", required: true },
  { name: "city", label: "Cidade", placeholder: "Preenchida pelo CEP", required: true },
  { name: "state", label: "UF", placeholder: "UF", required: true, maxLength: 2 }
];

const documentAttachmentField: CertificateField = {
  name: "documentAttachment",
  label: "Anexar documento",
  type: "file",
  placeholder: "",
  required: true,
  wide: true,
  accept: ".pdf,.jpg,.jpeg,.png",
  helper: "Anexe RG, CNH ou outro documento oficial com foto."
};

const certificatePasswordField: CertificateField = {
  name: "certificatePassword",
  label: "Senha",
  type: "password",
  placeholder: "Mínimo de 8 caracteres",
  required: true,
  minLength: 8,
  helper: "A senha do certificado digital deve ter no mínimo 8 caracteres."
};

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

const paymentOptions = [
  { id: "card" as PaymentMethod, label: "Cartão", helper: "Aprovação imediata", icon: CreditCard },
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
    note: "CPF ou CNPJ, nome, e-mail e endereço são a base do cadastro ICP-Brasil. RG e telefone ajudam nossa equipe na conferência.",
    fields: [
      identityField,
      { name: "fullName", label: "Nome completo", placeholder: "Nome como consta no CPF", required: true, wide: true },
      { name: "email", label: "E-mail do titular", placeholder: "nome@email.com", required: true, type: "email", inputMode: "email" },
      { name: "phone", label: "Telefone/WhatsApp", placeholder: "(00) 00000-0000", required: true, inputMode: "tel" },
      { name: "rg", label: "RG ou CNH", placeholder: "Documento com foto", inputMode: "text" },
      ...addressFields
    ]
  },
  pj: {
    eyebrow: "Dados da empresa",
    title: "Preencha os dados do e-CNPJ",
    description: "Informe a empresa titular e o responsável legal perante o CNPJ.",
    note: "Para pessoa jurídica, o certificado cruza CPF ou CNPJ válido com os dados do responsável legal. O CEP inicia o preenchimento do endereço.",
    fields: [
      identityField,
      { name: "corporateName", label: "Razão social", placeholder: "Razão social da empresa", required: true, wide: true },
      { name: "responsibleName", label: "Nome do responsável", placeholder: "Responsável perante o CNPJ", required: true, wide: true },
      { name: "responsibleCpf", label: "CPF do responsável", placeholder: "000.000.000-00", required: true, inputMode: "numeric" },
      { name: "responsibleEmail", label: "E-mail do responsável", placeholder: "responsavel@email.com", required: true, type: "email", inputMode: "email" },
      { name: "responsiblePhone", label: "Telefone/WhatsApp", placeholder: "(00) 00000-0000", required: true, inputMode: "tel" },
      { name: "rg", label: "RG ou CNH", placeholder: "Documento com foto do responsável", inputMode: "text" },
      ...addressFields
    ]
  },
  nfe: {
    eyebrow: "Dados fiscais",
    title: "Preencha os dados para NF-e",
    description: "Informe os dados da empresa emissora e do responsável pela validação.",
    note: "NF-e usa certificado de pessoa jurídica para emissão fiscal. O CEP inicia o preenchimento do endereço e ajuda a direcionar a configuração depois da compra.",
    fields: [
      identityField,
      { name: "corporateName", label: "Razão social", placeholder: "Razão social da empresa", required: true, wide: true },
      { name: "stateRegistration", label: "Inscrição estadual", placeholder: "Informe se houver", inputMode: "numeric" },
      { name: "fiscalEmail", label: "E-mail fiscal", placeholder: "fiscal@empresa.com.br", required: true, type: "email", inputMode: "email", wide: true },
      { name: "responsibleName", label: "Responsável pela validação", placeholder: "Nome completo", required: true, wide: true },
      { name: "responsibleCpf", label: "CPF do responsável", placeholder: "000.000.000-00", required: true, inputMode: "numeric" },
      { name: "responsiblePhone", label: "Telefone/WhatsApp", placeholder: "(00) 00000-0000", required: true, inputMode: "tel" },
      { name: "rg", label: "RG ou CNH", placeholder: "Documento com foto do responsável", inputMode: "text" },
      ...addressFields
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

function getCertificateFields(fields: CertificateField[]) {
  const documentIndex = fields.findIndex(field => field.name === "rg");
  const additionalFields = [documentAttachmentField, certificatePasswordField];

  if (documentIndex === -1) return [...fields, ...additionalFields];

  return [
    ...fields.slice(0, documentIndex + 1),
    ...additionalFields,
    ...fields.slice(documentIndex + 1)
  ];
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
  const certificateFields = useMemo(
    () => getCertificateFields(certificateForm.fields),
    [certificateForm.fields]
  );
  const validities = selectedProduct ? getAvailableValidities(selectedProduct) : [];
  const activeValidity = validities.includes(requestedValidity) ? requestedValidity : validities[0] ?? 12;
  const basePrice = selectedProduct?.pricesByValidity[activeValidity] ?? 0;
  const surcharge = selectedDevice.productType === "A3" ? selectedDevice.surcharge : 0;
  const certificateTotal = basePrice + surcharge;
  const firstCharge = certificateTotal + (includeAddon ? ADDON_MONTHLY_PRICE : 0);

  useEffect(() => {
    const zipCode = certificateData.zipCode?.replace(/\D/g, "") ?? "";
    if (zipCode.length !== 8) return;

    let cancelled = false;

    async function fillAddressByZipCode() {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
        const data = await response.json() as {
          erro?: boolean;
          logradouro?: string;
          bairro?: string;
          localidade?: string;
          uf?: string;
        };

        if (cancelled || data.erro) return;

        setCertificateData(current => {
          const currentZipCode = current.zipCode?.replace(/\D/g, "") ?? "";
          if (currentZipCode !== zipCode) return current;

          return {
            ...current,
            street: data.logradouro ?? current.street ?? "",
            district: data.bairro ?? current.district ?? "",
            city: data.localidade ?? current.city ?? "",
            state: data.uf ?? current.state ?? ""
          };
        });
      } catch {
        // Mantem o preenchimento manual quando o CEP nao puder ser consultado.
      }
    }

    void fillAddressByZipCode();

    return () => {
      cancelled = true;
    };
  }, [certificateData.zipCode]);

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
              Voltar para configuração
            </Link>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.2em] text-ocean">
              {checkoutStep === "details" ? "Dados do certificado" : "Checkout"}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">
              {checkoutStep === "details" ? "Informe os dados para emissão" : "Finalize seu certificado digital"}
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-500">
              {checkoutStep === "details"
                ? "Antes do pagamento, confira os dados que serão usados para preparar a validação do certificado."
                : "Escolha a forma de pagamento, revise o pedido e acompanhe a preparação após a confirmação."}
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
                    {certificateFields.map(field => {
                      const value = certificateData[field.name] ?? "";
                      const minLength = field.minLength ?? 0;
                      const hasMinLength = !minLength || value.length >= minLength;
                      const passwordProgress = minLength ? Math.min((value.length / minLength) * 100, 100) : 0;
                      const isFileField = field.type === "file";

                      return (
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
                            value={isFileField ? undefined : value}
                            onChange={event => {
                              if (isFileField) {
                                updateCertificateData(field.name, event.target.files?.[0]?.name ?? "");
                                return;
                              }

                              updateCertificateData(field.name, event.target.value);
                            }}
                            placeholder={field.placeholder}
                            required={field.required}
                            inputMode={field.inputMode}
                            maxLength={field.maxLength}
                            minLength={field.minLength}
                            accept={field.accept}
                            className="focus-ring mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-700 placeholder:text-slate-300"
                          />
                          {field.helper && minLength > 0 && (
                            <span className="mt-2 block normal-case tracking-normal">
                              <span className="block h-1.5 overflow-hidden rounded-full bg-slate-200">
                                <span
                                  className={`block h-full rounded-full transition-all ${
                                    hasMinLength ? "bg-trust" : "bg-amber-400"
                                  }`}
                                  style={{ width: `${passwordProgress}%` }}
                                />
                              </span>
                              <span
                                className={`mt-1 block text-[11px] font-bold ${
                                  hasMinLength ? "text-trust" : "text-slate-500"
                                }`}
                              >
                                {value
                                  ? hasMinLength
                                    ? "Senha com mínimo de 8 caracteres."
                                    : `${value.length}/8 caracteres - mínimo de 8.`
                                  : field.helper}
                              </span>
                            </span>
                          )}
                          {field.helper && !minLength && (
                            <span className="mt-2 block text-[11px] font-bold normal-case tracking-normal text-slate-500">
                              {isFileField && value ? `Arquivo selecionado: ${value}` : field.helper}
                            </span>
                          )}
                        </label>
                      );
                    })}
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
                    Voltar para configuração
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
                      Número do cartão
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
                      Preencher cartão teste
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
                        {copiedPix ? "Código copiado" : "Copiar código Pix"}
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
                  <p className="text-sm font-black text-ink">Linha digitável</p>
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
                {selectedCertificate.label} com {selectedDevice.label} e validação por {selectedValidation.title}.
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
                  <span className="mt-3 block text-xl font-black leading-tight text-ink">Saúde do seu negócio</span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-slate-600">
                    Monitoramento mensal para acompanhar a reputação e riscos do CNPJ.
                  </span>
                  <span className="mt-3 inline-flex rounded-full border border-lime-200 bg-white px-3 py-1.5 text-sm font-black text-trust shadow-sm">
                    + {formatCurrency(ADDON_MONTHLY_PRICE)}/mês
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
