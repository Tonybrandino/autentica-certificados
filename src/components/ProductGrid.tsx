"use client";

import type { CertificateProduct, ValidationMethod, ValidityStep } from "@/data/products";
import { products, validationMethods } from "@/data/products";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  CreditCard,
  FileArchive,
  HardDrive,
  KeyRound,
  MapPin,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Video
} from "lucide-react";
import { useMemo, useState } from "react";

type CertificateChoice = "pf" | "pj" | "nfe";
type DeviceChoice = "arquivo" | "smartcard" | "smartcard-leitora" | "token";
type StepKey = "validation" | "certificate" | "device" | "validity";

type SelectOption = {
  id: string;
  label: string;
  helper: string;
  icon: typeof UserRound;
  selected: boolean;
  onClick: () => void;
};

const certificateOptions = [
  { id: "pf" as CertificateChoice, label: "Pessoa Física", helper: "e-CPF para uso pessoal", icon: UserRound },
  { id: "pj" as CertificateChoice, label: "Pessoa Jurídica", helper: "e-CNPJ para empresas", icon: Building2 },
  { id: "nfe" as CertificateChoice, label: "NF-e", helper: "Emissão de nota fiscal", icon: ReceiptText }
];

const deviceOptions = [
  { id: "arquivo" as DeviceChoice, label: "Arquivo A1", helper: "Instalado no computador", productType: "A1" as const, surcharge: 0, icon: FileArchive },
  { id: "smartcard" as DeviceChoice, label: "SmartCard", helper: "A3 em cartão (+R$ 70)", productType: "A3" as const, surcharge: 70, icon: CreditCard },
  { id: "smartcard-leitora" as DeviceChoice, label: "SmartCard + Leitora", helper: "A3 com leitora inclusa (+R$ 120)", productType: "A3" as const, surcharge: 120, icon: HardDrive },
  { id: "token" as DeviceChoice, label: "Token USB", helper: "A3 em mídia USB (+R$ 90)", productType: "A3" as const, surcharge: 90, icon: KeyRound }
];

const validationIconById: Record<ValidationMethod, typeof Video> = {
  video: Video,
  renovacao: RefreshCw,
  presencial: MapPin
};

const orderedValidations = ["video", "renovacao", "presencial"]
  .map(id => validationMethods.find(m => m.id === id))
  .filter(Boolean) as typeof validationMethods;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function getAvailableValidities(product: CertificateProduct) {
  return Object.keys(product.pricesByValidity).map(Number).sort((a, b) => a - b) as ValidityStep[];
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

export function ProductGrid() {
  const [validation, setValidation] = useState<ValidationMethod>("video");
  const [certificate, setCertificate] = useState<CertificateChoice>("pf");
  const [device, setDevice] = useState<DeviceChoice>("arquivo");
  const [validity, setValidity] = useState<ValidityStep>(12);
  const [activeStep, setActiveStep] = useState<StepKey>("validation");

  const steps: StepKey[] = ["validation", "certificate", "device", "validity"];
  const stepIndex = steps.indexOf(activeStep);
  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < steps.length - 1;

  const selDev = deviceOptions.find(o => o.id === device) ?? deviceOptions[0];
  const selVal = orderedValidations.find(m => m.id === validation) ?? orderedValidations[0];
  const selCert = certificateOptions.find(o => o.id === certificate) ?? certificateOptions[0];
  const selProduct = useMemo(() => getProduct(certificate, device), [certificate, device]);
  const validities = useMemo(() => selProduct ? getAvailableValidities(selProduct) : [], [selProduct]);
  const activeValidity = validities.includes(validity) ? validity : validities[0];
  const basePrice = selProduct?.pricesByValidity[activeValidity] ?? 0;
  const surcharge = selDev.productType === "A3" ? selDev.surcharge : 0;
  const total = basePrice + surcharge;
  const installment = total / 12;
  const totalAVista = Math.round(total * 0.95 * 100) / 100;

  function goNext() { if (canGoNext) setActiveStep(steps[stepIndex + 1]); }
  function goPrev() { if (canGoBack) setActiveStep(steps[stepIndex - 1]); }
  function pick(key: StepKey, cb: () => void) {
    cb();
    if (activeStep === key && key !== "validity") goNext();
  }

  const stepDefs = [
    {
      key: "validation" as StepKey,
      num: 1,
      label: "Validação",
      value: selVal?.title ?? "-",
      description: "Como sua identidade será confirmada.",
      options: orderedValidations.map(m => ({
        id: m.id, label: m.title, helper: m.subtitle,
        icon: validationIconById[m.id], selected: validation === m.id,
        onClick: () => pick("validation", () => setValidation(m.id))
      }))
    },
    {
      key: "certificate" as StepKey,
      num: 2,
      label: "Certificado",
      value: selCert.label,
      description: "Defina o uso principal do certificado digital.",
      options: certificateOptions.map(o => ({
        id: o.id, label: o.label, helper: o.helper,
        icon: o.icon, selected: certificate === o.id,
        onClick: () => pick("certificate", () => setCertificate(o.id))
      }))
    },
    {
      key: "device" as StepKey,
      num: 3,
      label: "Dispositivo",
      value: selDev.label,
      description: "Selecione a forma de armazenamento.",
      options: deviceOptions.map(o => ({
        id: o.id, label: o.label, helper: o.helper,
        icon: o.icon, selected: device === o.id,
        onClick: () => pick("device", () => setDevice(o.id))
      }))
    },
    {
      key: "validity" as StepKey,
      num: 4,
      label: "Validade",
      value: activeValidity ? `${activeValidity} meses` : "-",
      description: "Escolha o período ideal para sua rotina.",
      options: validities.map(months => ({
        id: String(months), label: `${months} meses`,
        helper: formatCurrency(selProduct?.pricesByValidity[months] ?? 0),
        icon: CalendarDays, selected: activeValidity === months,
        onClick: () => setValidity(months)
      }))
    }
  ];

  const current = stepDefs.find(s => s.key === activeStep) ?? stepDefs[0];
  const isValidity = activeStep === "validity";

  return (
    <section id="certificados" className="relative pb-20 pt-8 sm:pb-24 sm:pt-10">
      <div className="section-shell">

        {/* Section header */}
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-ocean">
            Configurador Inteligente
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">
            Configure seu certificado sem perder tempo
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-500">
            Encontre o modelo mais adequado para sua necessidade em poucos passos.
          </p>
        </div>

        {/* Outer grid: main card + summary sidebar */}
        <div className="grid gap-5 lg:grid-cols-[1fr_292px]">

          {/* ── Main card ── */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-soft">

            {/* Mobile step pills */}
            <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-5 py-3 lg:hidden">
              {stepDefs.map(s => {
                const done = steps.indexOf(s.key) < stepIndex;
                const active = s.key === activeStep;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setActiveStep(s.key)}
                    className={`focus-ring flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                      active ? "border-ocean bg-ocean text-white" :
                      done   ? "border-sky-200 bg-sky-50 text-ocean" :
                               "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    {done
                      ? <Check size={10} strokeWidth={3} aria-hidden="true" />
                      : <span className="opacity-60">{s.num}</span>}
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Inner layout: step tracker + content */}
            <div className="flex min-h-[340px]">

              {/* ── Vertical step tracker — desktop ── */}
              <aside className="hidden w-52 shrink-0 border-r border-slate-100 py-6 pl-6 pr-4 lg:block">
                <ol className="flex flex-col gap-0">
                  {stepDefs.map((s, i) => {
                    const done = steps.indexOf(s.key) < stepIndex;
                    const active = s.key === activeStep;
                    const last = i === stepDefs.length - 1;

                    return (
                      <li key={s.key} className="flex gap-3">
                        {/* Circle + line column */}
                        <div className="flex flex-col items-center">
                          <button
                            type="button"
                            onClick={() => setActiveStep(s.key)}
                            aria-current={active ? "step" : undefined}
                            className={`focus-ring relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition ${
                              done
                                ? "bg-ocean text-white"
                                : active
                                ? "border-2 border-ocean bg-white text-ocean shadow-[0_0_0_4px_rgba(0,120,174,0.10)]"
                                : "border-2 border-slate-200 bg-white text-slate-400"
                            }`}
                          >
                            {done ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : s.num}
                          </button>
                          {!last && (
                            <div
                              className={`my-1 w-px flex-1 ${done ? "bg-ocean/40" : "bg-slate-200"}`}
                              style={{ minHeight: "32px" }}
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        {/* Text */}
                        <button
                          type="button"
                          onClick={() => setActiveStep(s.key)}
                          className={`focus-ring mb-4 flex-1 rounded-lg px-2 py-1 text-left last:mb-0 transition hover:bg-slate-50 ${last ? "mb-0" : ""}`}
                        >
                          <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                            Passo {s.num}
                          </span>
                          <span className={`mt-0.5 block text-sm font-extrabold leading-tight ${active ? "text-ocean" : "text-slate-700"}`}>
                            {s.label}
                          </span>
                          <span className="mt-0.5 block truncate text-xs font-semibold text-slate-500">
                            {s.value}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </aside>

              {/* ── Step content ── */}
              <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="flex flex-1 flex-col"
                  >
                    {/* Step header */}
                    <div className="mb-5">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-400">
                        Passo {current.num} de 4
                      </p>
                      <h3 className="mt-1 text-xl font-black text-ink sm:text-2xl">
                        {current.label}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{current.description}</p>
                    </div>

                    {/* Options */}
                    <div
                      className={`grid gap-3 ${
                        isValidity
                          ? "grid-cols-2 sm:grid-cols-3"
                          : "grid-cols-1 sm:grid-cols-2"
                      }`}
                    >
                      {current.options.map(opt => (
                        <OptionCard key={opt.id} {...opt} />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!canGoBack}
                    className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-extrabold text-slate-600 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowLeft size={15} aria-hidden="true" />
                    Voltar
                  </button>

                  {/* Progress dots */}
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {steps.map((s, i) => (
                      <span
                        key={s}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i < stepIndex  ? "w-4 bg-ocean" :
                          i === stepIndex ? "w-5 bg-ocean" :
                                           "w-1.5 bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canGoNext}
                    className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-xl bg-ocean px-5 text-sm font-extrabold text-white transition enabled:hover:bg-[#006B9A] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Próximo
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Summary sidebar ── */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft lg:h-fit">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                Total Estimado
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-extrabold text-ocean">
                <ShieldCheck size={12} aria-hidden="true" />
                ICP-Brasil
              </span>
            </div>

            {/* Parcelado */}
            <div className="mt-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Em 12 vezes</p>
              <p className="mt-0.5 font-black leading-none text-ink">
                <span className="text-base">12x </span>
                <span className="text-[2.2rem]">{formatCurrency(installment)}</span>
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Total: {formatCurrency(total)}
              </p>
            </div>

            {/* À vista */}
            <div
              className="mt-3 rounded-xl border px-3 py-2.5"
              style={{ background: "rgba(20,184,122,0.07)", borderColor: "rgba(20,184,122,0.22)" }}
            >
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-trust">
                À vista com Pix
              </p>
              <p className="mt-0.5 text-xl font-black text-trust">{formatCurrency(totalAVista)}</p>
              <p className="text-[11px] font-semibold text-slate-500">5% de desconto</p>
            </div>

            {/* Formas de pagamento */}
            <div className="mt-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                Pagamento
              </p>
              <p className="mt-0.5 text-[11px] font-semibold leading-5 text-slate-600">
                Cartão de Crédito ou Pix Recorrente/Programado
              </p>
            </div>

            {/* Resumo seleções */}
            <div className="mt-3 space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <SummaryRow label="Validação" value={selVal?.title ?? "-"} />
              <SummaryRow label="Certificado" value={selCert.label} />
              <SummaryRow label="Dispositivo" value={selDev.label} />
              <SummaryRow label="Validade" value={activeValidity ? `${activeValidity} meses` : "-"} />
            </div>

            {/* Progress bar */}
            <div className="mt-4 flex gap-1" aria-hidden="true">
              {steps.map((s, i) => (
                <span
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= stepIndex ? "bg-ocean" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <motion.a
              href="#comprar"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.985 }}
              className="focus-ring mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-trust px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#12a76f]"
            >
              Continuar
              <ArrowRight size={16} aria-hidden="true" />
            </motion.a>
          </aside>
        </div>
      </div>
    </section>
  );
}

type OptionCardProps = {
  label: string;
  helper: string;
  icon: typeof UserRound;
  selected: boolean;
  onClick: () => void;
};

function OptionCard({ label, helper, icon: Icon, selected, onClick }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      className={`focus-ring group flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-ocean bg-gradient-to-br from-sky-50 to-cyan-50/70 shadow-soft"
          : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/40"
      }`}
    >
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
          selected
            ? "bg-ocean text-white"
            : "bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-ocean"
        }`}
        aria-hidden="true"
      >
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-slate-800">{label}</span>
        <span className="mt-0.5 block text-xs font-semibold leading-5 text-slate-500">{helper}</span>
      </span>
      {selected && (
        <CheckCircle2 size={16} className="ml-auto mt-0.5 shrink-0 text-ocean" aria-hidden="true" />
      )}
    </motion.button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-center justify-between gap-3 text-xs">
      <span className="font-semibold text-slate-400">{label}</span>
      <span className="text-right font-bold text-slate-700">{value}</span>
    </p>
  );
}
