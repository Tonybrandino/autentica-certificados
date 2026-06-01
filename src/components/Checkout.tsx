"use client";

import type { CertificateProduct, ValidationMethod, ValidityStep } from "@/data/products";
import { products, validationMethods } from "@/data/products";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Barcode,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type CertificateChoice = "pf" | "pj" | "nfe";
type DeviceChoice = "arquivo" | "smartcard" | "smartcard-leitora" | "token";
type PaymentMethod = "card" | "pix" | "boleto";
type PaymentStatus = "idle" | "paid";

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
  { id: "smartcard" as DeviceChoice, label: "SmartCard", productType: "A3" as const, surcharge: 70 },
  { id: "smartcard-leitora" as DeviceChoice, label: "SmartCard + Leitora", productType: "A3" as const, surcharge: 120 },
  { id: "token" as DeviceChoice, label: "Token USB", productType: "A3" as const, surcharge: 90 }
];

const paymentOptions = [
  { id: "card" as PaymentMethod, label: "Cartao", helper: "Aprovacao imediata", icon: CreditCard },
  { id: "pix" as PaymentMethod, label: "Pix", helper: "QR Code e copia e cola", icon: Banknote },
  { id: "boleto" as PaymentMethod, label: "Boleto", helper: "Abrir e imprimir PDF", icon: Barcode }
];

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
  return value === "arquivo" || value === "smartcard" || value === "smartcard-leitora" || value === "token";
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
  const params = useSearchParams();
  const certificateParam = params.get("certificate");
  const deviceParam = params.get("device");
  const validationParam = params.get("validation");

  const certificate = isCertificateChoice(certificateParam) ? certificateParam : "pf";
  const device = isDeviceChoice(deviceParam) ? deviceParam : "arquivo";
  const validation = isValidationMethod(validationParam) ? validationParam : "video";
  const requestedValidity = parseValidity(params.get("validity"));

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [includeAddon, setIncludeAddon] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
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
  const validities = selectedProduct ? getAvailableValidities(selectedProduct) : [];
  const activeValidity = validities.includes(requestedValidity) ? requestedValidity : validities[0] ?? 12;
  const basePrice = selectedProduct?.pricesByValidity[activeValidity] ?? 0;
  const surcharge = selectedDevice.productType === "A3" ? selectedDevice.surcharge : 0;
  const certificateTotal = basePrice + surcharge;
  const firstCharge = certificateTotal + (includeAddon ? ADDON_MONTHLY_PRICE : 0);
  const deliveryText =
    selectedDevice.productType === "A1"
      ? "Certificado A1 enviado por e-mail apos a validacao."
      : "Token ou SmartCard preparado para envio pelos Correios.";

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
    setPaymentStatus("paid");
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
              Checkout
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">
              Finalize seu certificado digital
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-500">
              Escolha a forma de pagamento, revise o pedido e acompanhe a preparacao apos a confirmacao.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-lime-100 bg-white px-4 py-2 text-sm font-extrabold text-ocean shadow-sm">
            <ShoppingCart size={17} aria-hidden="true" />
            Resumo de compra
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-3xl border border-lime-100 bg-white p-5 shadow-lift sm:p-7">
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
                    onClick={() => {
                      setPaymentMethod(option.id);
                      setPaymentStatus("idle");
                    }}
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

            {paymentStatus === "paid" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-3xl border border-lime-200 bg-lime-50 p-5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-trust" size={24} aria-hidden="true" />
                  <div>
                    <h3 className="text-xl font-black text-ink">Pagamento confirmado</h3>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                      Pedido recebido. A validacao sera preparada e nossa equipe acompanha as proximas etapas.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <ProcessStep title="1. Pedido recebido" active />
                      <ProcessStep title="2. Validacao em preparo" active />
                      <ProcessStep title={selectedDevice.productType === "A1" ? "3. Envio por e-mail" : "3. Envio por Correios"} active />
                    </div>
                    <p className="mt-4 rounded-2xl bg-white p-3 text-sm font-bold text-ocean">{deliveryText}</p>
                  </div>
                </div>
              </motion.div>
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
            </div>

            <label className="mt-4 block cursor-pointer rounded-3xl border border-lime-200 bg-[linear-gradient(135deg,rgba(126,208,56,0.18),rgba(255,255,255,0.95))] p-4 shadow-[0_16px_34px_rgba(92,175,24,0.12)]">
              <span className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={includeAddon}
                  onChange={event => setIncludeAddon(event.target.checked)}
                  className="mt-1 h-5 w-5 accent-[#7ed038]"
                />
                <span>
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-trust">
                    Produto adicional
                  </span>
                  <span className="mt-1 block text-lg font-black text-ink">Saude do seu negocio</span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-slate-600">
                    Monitoramento mensal para acompanhar a reputacao e riscos do CNPJ.
                  </span>
                  <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-sm font-black text-trust">
                    + {formatCurrency(ADDON_MONTHLY_PRICE)}/mes
                  </span>
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

function ProcessStep({ title, active }: { title: string; active: boolean }) {
  return (
    <span
      className={`rounded-2xl px-3 py-2 text-xs font-black ${
        active ? "bg-white text-ocean" : "bg-slate-100 text-slate-400"
      }`}
    >
      {title}
    </span>
  );
}
