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
    <section
      id="certificados"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fcf3_0%,#eef8e8_48%,#f9fdf5_100%)] py-16 sm:py-20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-200 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-lime-200 to-transparent" aria-hidden="true" />
      <div className="section-shell relative">

        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-ocean">
              Configurador Inteligente
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">
              Configure, compare e avance com segurança
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-500">
              Escolha o certificado ideal em poucos passos e veja o valor atualizado em tempo real.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-100 bg-white px-3 py-2 text-xs font-extrabold text-ocean shadow-sm">
              <ShieldCheck size={14} aria-hidden="true" />
              ICP-Brasil
            </span>
            <span className="inline-flex items-center rounded-full border border-lime-100 bg-white px-3 py-2 text-xs font-extrabold text-trust shadow-sm">
              Pix com desconto
            </span>
          </div>
        </div>

        <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">

          <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-lime-100 bg-white shadow-lift">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ocean via-cyanx to-trust" aria-hidden="true" />

            <div className="overflow-x-auto border-b border-lime-100 bg-slate-50/70 px-4 py-4 sm:px-5 lg:px-6">
              <ol className="grid min-w-[720px] grid-cols-4 gap-2 lg:min-w-0">
                {stepDefs.map(s => {
                  const done = steps.indexOf(s.key) < stepIndex;
                  const active = s.key === activeStep;

                  return (
                    <li key={s.key}>
                      <button
                        type="button"
                        onClick={() => setActiveStep(s.key)}
                        aria-current={active ? "step" : undefined}
                        className={`focus-ring flex h-full w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                          active
                            ? "border-ocean bg-white shadow-[0_14px_30px_rgba(63,127,18,0.14)]"
                            : done
                            ? "border-lime-100 bg-white hover:border-lime-200"
                            : "border-transparent bg-transparent hover:border-slate-200 hover:bg-white"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition ${
                            done
                              ? "bg-ocean text-white"
                              : active
                              ? "border-2 border-ocean bg-white text-ocean shadow-[0_0_0_4px_rgba(63,127,18,0.12)]"
                              : "border-2 border-slate-200 bg-white text-slate-400"
                          }`}
                        >
                          {done ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : s.num}
                        </span>
                        <span className="min-w-0">
                          <span className={`block text-[10px] font-extrabold uppercase tracking-[0.14em] ${active ? "text-ocean" : "text-slate-400"}`}>
                            Passo {s.num}
                          </span>
                          <span className={`mt-0.5 block truncate text-sm font-extrabold leading-tight ${active ? "text-ocean" : "text-slate-700"}`}>
                            {s.label}
                          </span>
                          <span className="mt-0.5 block truncate text-xs font-semibold text-slate-500">
                            {s.value}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="flex min-h-[400px] flex-1 lg:min-h-[390px]">

              <div className="flex min-w-0 flex-1 flex-col p-6 sm:p-7 lg:p-9">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="flex flex-1 flex-col"
                  >
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-lime-700">
                          Passo {current.num} de 4
                        </p>
                          <h3 className="mt-1 text-2xl font-black text-ink sm:text-[1.7rem]">
                          {current.label}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{current.description}</p>
                      </div>
                      <span className="inline-flex w-fit items-center rounded-full border border-lime-100 bg-lime-50 px-3 py-1.5 text-xs font-extrabold text-ocean">
                        {Math.round(((stepIndex + 1) / steps.length) * 100)}% concluído
                      </span>
                    </div>

                    <div
                      className={`grid max-w-2xl gap-3 ${
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

                <div className="mt-7 flex items-center justify-between gap-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!canGoBack}
                    className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-600 transition enabled:hover:border-lime-200 enabled:hover:text-ocean disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowLeft size={15} aria-hidden="true" />
                    Voltar
                  </button>

                  <div className="flex items-center gap-2" aria-hidden="true">
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
                    className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-ocean px-5 text-sm font-extrabold text-white shadow-soft transition enabled:hover:bg-[#32680f] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Próximo
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-3xl border border-lime-100 bg-white p-5 shadow-lift lg:sticky lg:top-24 lg:h-fit">
            <div className="absolute inset-x-0 top-0 h-1 bg-trust" aria-hidden="true" />
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                Total Estimado
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-lime-50 px-2.5 py-1 text-[10px] font-extrabold text-ocean">
                <ShieldCheck size={12} aria-hidden="true" />
                ICP-Brasil
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Em 12 vezes</p>
              <p className="mt-0.5 font-black leading-none text-ink">
                <span className="text-base">12x </span>
                <span className="text-[2.45rem]">{formatCurrency(installment)}</span>
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Total: {formatCurrency(total)}
              </p>
            </div>

            <div
              className="mt-3 rounded-2xl border px-4 py-3"
              style={{ background: "rgba(126,208,56,0.12)", borderColor: "rgba(92,175,24,0.3)" }}
            >
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-trust">
                À vista com Pix
              </p>
              <p className="mt-0.5 text-2xl font-black text-trust">{formatCurrency(totalAVista)}</p>
              <p className="text-[11px] font-semibold text-slate-500">5% de desconto</p>
            </div>

            <div className="mt-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                Pagamento
              </p>
              <p className="mt-0.5 text-[11px] font-semibold leading-5 text-slate-600">
                Cartão de Crédito ou Pix Recorrente/Programado
              </p>
            </div>

            <div className="mt-3 space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <SummaryRow label="Validação" value={selVal?.title ?? "-"} />
              <SummaryRow label="Certificado" value={selCert.label} />
              <SummaryRow label="Dispositivo" value={selDev.label} />
              <SummaryRow label="Validade" value={activeValidity ? `${activeValidity} meses` : "-"} />
            </div>

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
              className="focus-ring mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-trust px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_35px_rgba(92,175,24,0.26)] transition hover:bg-[#4e9f16]"
            >
              Continuar
              <ArrowRight size={16} aria-hidden="true" />
            </motion.a>
            <p className="mt-3 text-center text-[11px] font-semibold text-slate-500">
              Atendimento guiado após a confirmação.
            </p>
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
      className={`focus-ring group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-ocean bg-gradient-to-br from-lime-50 to-green-50/70 shadow-[0_16px_35px_rgba(63,127,18,0.16)]"
          : "border-slate-200 bg-white hover:border-lime-200 hover:bg-lime-50/40 hover:shadow-soft"
      }`}
    >
      <span
        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
          selected
            ? "bg-ocean text-white"
            : "bg-slate-100 text-slate-500 group-hover:bg-lime-100 group-hover:text-ocean"
        }`}
        aria-hidden="true"
      >
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-extrabold leading-snug text-slate-800">{label}</span>
        <span className="mt-1 block text-sm font-semibold leading-5 text-slate-500">{helper}</span>
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
