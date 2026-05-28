"use client";

import type { CertificateProduct, ValidityStep } from "@/data/products";
import { products } from "@/data/products";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileArchive,
  HardDrive,
  KeyRound,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  UserRound
} from "lucide-react";
import { useMemo, useState } from "react";

type CertificateChoice = "pf" | "pj" | "nfe";
type DeviceChoice = "arquivo" | "cartao" | "cartao-leitora" | "token" | "birdid";

type CertificateOption = {
  id: CertificateChoice;
  label: string;
  helper: string;
  icon: typeof UserRound;
};

type DeviceOption = {
  id: DeviceChoice;
  label: string;
  helper: string;
  productType: "A1" | "A3" | "Nuvem";
  surcharge: number;
  icon: typeof FileArchive;
};

type SelectOption = {
  id: string;
  label: string;
  helper: string;
  icon: typeof UserRound;
  selected: boolean;
  onClick: () => void;
};

type StepKey = "certificate" | "device" | "validity";

const certificateOptions: CertificateOption[] = [
  { id: "pf", label: "Pessoa Física", helper: "e-CPF", icon: UserRound },
  { id: "pj", label: "Pessoa Jurídica", helper: "e-CNPJ", icon: Building2 },
  { id: "nfe", label: "NF-e", helper: "Nota fiscal eletrônica", icon: ReceiptText }
];

const deviceOptions: DeviceOption[] = [
  {
    id: "arquivo",
    label: "Arquivo",
    helper: "A1 instalado no computador",
    productType: "A1",
    surcharge: 0,
    icon: FileArchive
  },
  {
    id: "cartao",
    label: "Cartão",
    helper: "A3 em cartão",
    productType: "A3",
    surcharge: 70,
    icon: CreditCard
  },
  {
    id: "cartao-leitora",
    label: "Cartão + Leitora",
    helper: "A3 com leitora inclusa",
    productType: "A3",
    surcharge: 120,
    icon: HardDrive
  },
  {
    id: "token",
    label: "Token",
    helper: "A3 em mídia USB",
    productType: "A3",
    surcharge: 90,
    icon: KeyRound
  },
  {
    id: "birdid",
    label: "Bird ID (Nuvem)",
    helper: "Certificado em nuvem via app",
    productType: "Nuvem",
    surcharge: 0,
    icon: Smartphone
  }
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function getAvailableValidities(product: CertificateProduct) {
  return Object.keys(product.pricesByValidity)
    .map(Number)
    .sort((a, b) => a - b) as ValidityStep[];
}

function getProduct(certificate: CertificateChoice, device: DeviceChoice) {
  if (certificate === "nfe") {
    return products.find((product) => product.id === "nfe") ?? null;
  }

  const selectedDevice = deviceOptions.find((option) => option.id === device) ?? deviceOptions[0];
  const profile = certificate === "pf" ? "pf" : "pj";

  return (
    products.find((product) => product.profile === profile && product.type === selectedDevice.productType) ??
    products.find((product) => product.profile === profile) ??
    null
  );
}

export function ProductGrid() {
  const [certificate, setCertificate] = useState<CertificateChoice>("pf");
  const [device, setDevice] = useState<DeviceChoice>("arquivo");
  const [validity, setValidity] = useState<ValidityStep>(12);
  const [activeStep, setActiveStep] = useState<StepKey>("certificate");

  const steps: StepKey[] = ["certificate", "device", "validity"];

  const visibleDeviceOptions = useMemo(
    () => deviceOptions.filter((opt) => opt.id !== "birdid" || certificate === "pf"),
    [certificate]
  );

  const selectedDevice = deviceOptions.find((option) => option.id === device) ?? deviceOptions[0];
  const selectedCertificate = certificateOptions.find((option) => option.id === certificate) ?? certificateOptions[0];
  const selectedProduct = useMemo(() => getProduct(certificate, device), [certificate, device]);
  const availableValidities = useMemo(
    () => (selectedProduct ? getAvailableValidities(selectedProduct) : []),
    [selectedProduct]
  );
  const activeValidity = availableValidities.includes(validity) ? validity : availableValidities[0];
  const basePrice = selectedProduct?.pricesByValidity[activeValidity] ?? 0;
  const deviceSurcharge = selectedDevice.productType === "A3" ? selectedDevice.surcharge : 0;
  const total = basePrice + deviceSurcharge;
  const monthlyInstallment = total / 12;

  const stepIndex = steps.indexOf(activeStep);
  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < steps.length - 1;

  function goToNextStep() {
    if (!canGoNext) return;
    setActiveStep(steps[stepIndex + 1]);
  }

  function goToPrevStep() {
    if (!canGoBack) return;
    setActiveStep(steps[stepIndex - 1]);
  }

  function applyWithAdvance(key: StepKey, callback: () => void) {
    callback();
    if (activeStep === key && key !== "validity") {
      goToNextStep();
    }
  }

  function onCertificateSelect(cert: CertificateChoice) {
    setCertificate(cert);
    if (cert !== "pf" && device === "birdid") {
      setDevice("arquivo");
    }
  }

  const certificateSelectOptions: SelectOption[] = certificateOptions.map((option) => ({
    id: option.id,
    label: option.label,
    helper: option.helper,
    icon: option.icon,
    selected: certificate === option.id,
    onClick: () => applyWithAdvance("certificate", () => onCertificateSelect(option.id))
  }));

  const deviceSelectOptions: SelectOption[] = visibleDeviceOptions.map((option) => ({
    id: option.id,
    label: option.label,
    helper: option.surcharge > 0 ? `${option.helper} | +${formatCurrency(option.surcharge)}` : option.helper,
    icon: option.icon,
    selected: device === option.id,
    onClick: () => applyWithAdvance("device", () => setDevice(option.id))
  }));

  const validitySelectOptions: SelectOption[] = availableValidities.map((months) => ({
    id: String(months),
    label: `${months} meses`,
    helper: formatCurrency(selectedProduct?.pricesByValidity[months] ?? 0),
    icon: CalendarDays,
    selected: activeValidity === months,
    onClick: () => setValidity(months)
  }));

  const stepViews: Record<
    StepKey,
    {
      step: string;
      title: string;
      description: string;
      options: SelectOption[];
    }
  > = {
    certificate: {
      step: "Passo 1",
      title: "Tipo de certificado",
      description: "Defina o uso principal do certificado digital.",
      options: certificateSelectOptions
    },
    device: {
      step: "Passo 2",
      title: "Formato",
      description: "Selecione como o certificado será armazenado.",
      options: deviceSelectOptions
    },
    validity: {
      step: "Passo 3",
      title: "Validade",
      description: "Escolha o período ideal para sua rotina.",
      options: validitySelectOptions
    }
  };

  const currentView = stepViews[activeStep];
  const timelineItems = [
    { key: "certificate", stepLabel: "Passo 1", title: "Certificado", value: selectedCertificate.label },
    { key: "device", stepLabel: "Passo 2", title: "Formato", value: selectedDevice.label },
    { key: "validity", stepLabel: "Passo 3", title: "Validade", value: activeValidity ? `${activeValidity} meses` : "-" }
  ] as const;

  return (
    <section id="certificados" className="relative pb-20 pt-8 sm:pb-24 sm:pt-10">
      <div className="section-shell">
        <div className="mb-7 max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-ocean">Configurador Inteligente</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">
            Configure seu certificado sem perder tempo
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 sm:text-base">
            Fluxo compacto: uma etapa por vez, total sempre visível.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="rounded-2xl border border-sky-100 bg-white/95 p-4 shadow-sm sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[250px_1fr]">
              <div className="relative rounded-xl border border-slate-100 bg-slate-50/70 p-3 sm:p-4">
                <span
                  className="absolute bottom-[22px] left-[26px] top-[22px] w-px bg-gradient-to-b from-sky-200 via-sky-300 to-slate-200"
                  aria-hidden="true"
                />
                <div className="space-y-2">
                  {timelineItems.map((item, index) => {
                    const itemIndex = steps.indexOf(item.key);
                    const isActive = item.key === activeStep;
                    const isDone = itemIndex < stepIndex;

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setActiveStep(item.key)}
                        className={`focus-ring relative z-10 flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left transition ${
                          isActive
                            ? "border-ocean bg-white shadow-sm"
                            : "border-transparent bg-transparent hover:border-slate-200 hover:bg-white/80"
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
                            isDone || isActive ? "bg-ocean text-white" : "bg-white text-slate-400"
                          }`}
                          aria-hidden="true"
                        >
                          {index + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                            {item.stepLabel}
                          </span>
                          <span className="block text-sm font-extrabold text-slate-700">{item.title}</span>
                          <span className="mt-0.5 block truncate text-xs font-semibold text-slate-500">{item.value}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <StepPanel
                step={currentView.step}
                title={currentView.title}
                description={currentView.description}
                options={currentView.options}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goToPrevStep}
                disabled={!canGoBack}
                className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-extrabold text-slate-700 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={15} aria-hidden="true" />
                Voltar
              </button>
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!canGoNext}
                className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg bg-ocean px-4 text-sm font-extrabold text-white transition enabled:hover:bg-[#006B9A] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Próximo
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>

          <aside className="rounded-2xl border border-sky-100 bg-white/95 p-4 shadow-soft backdrop-blur sm:p-5 lg:h-fit">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">Total Estimado</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-extrabold text-ocean">
                <ShieldCheck size={14} aria-hidden="true" />
                ICP-Brasil
              </span>
            </div>

            <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">Em 12 vezes</p>
            <p className="mt-1 text-4xl font-black leading-none text-ink sm:text-[2.7rem]">
              12x {formatCurrency(monthlyInstallment)}
            </p>
            <p className="mt-2 text-xs font-bold text-slate-500 sm:text-sm">
              Total: {formatCurrency(total)}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500">
              {selectedProduct?.name ?? "Produto"} | {activeValidity ?? 12} meses
            </p>

            <div className="mt-4 space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <SummaryLine label="Certificado" value={selectedCertificate.label} />
              <SummaryLine label="Formato" value={selectedDevice.label} />
              <SummaryLine label="Validade" value={activeValidity ? `${activeValidity} meses` : "-"} />
            </div>

            {/* Oferta combo: e-CNPJ A1 + Bird ID */}
            <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Oferta combo</p>
              <p className="mt-1 text-sm font-black text-ink">e-CNPJ A1 + Bird ID</p>
              <p className="mt-0.5 text-xs font-bold text-slate-600">12x R$&nbsp;14,50 · Total: R$&nbsp;174,00</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Bird ID Trial incluso gratuitamente</p>
            </div>

            {/* Formas de pagamento */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600">
                <CreditCard size={10} aria-hidden="true" />
                Cartão de crédito
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600">
                Pix recorrente
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((step) => (
                <span
                  key={step}
                  className={`h-1.5 rounded-full ${step <= stepIndex + 1 ? "bg-ocean" : "bg-slate-200"}`}
                  aria-hidden="true"
                />
              ))}
            </div>

            <motion.a
              href="#comprar"
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className="focus-ring mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-trust px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#12a76f]"
            >
              Continuar
              <ArrowRight size={17} aria-hidden="true" />
            </motion.a>
          </aside>
        </div>
      </div>
    </section>
  );
}

type StepPanelProps = {
  step: string;
  title: string;
  description: string;
  options: SelectOption[];
};

function StepPanel({ step, title, description, options }: StepPanelProps) {
  return (
    <article className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5 lg:min-h-[286px]">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-sky-400">{step}</p>
          <h3 className="mt-1 text-base font-black text-ink sm:text-lg">{title}</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">{description}</p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <OptionButton
            key={option.id}
            label={option.label}
            helper={option.helper}
            icon={option.icon}
            selected={option.selected}
            onClick={option.onClick}
          />
        ))}
      </div>
    </article>
  );
}

type OptionButtonProps = {
  label: string;
  helper: string;
  icon: typeof UserRound;
  selected: boolean;
  onClick: () => void;
};

function OptionButton({ label, helper, icon: Icon, selected, onClick }: OptionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      className={`focus-ring group flex min-h-[78px] items-start gap-3 rounded-xl border p-3 text-left transition ${
        selected
          ? "border-ocean bg-gradient-to-br from-sky-50 to-cyan-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/40"
      }`}
    >
      <span
        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
          selected ? "bg-ocean text-white" : "bg-slate-100 text-slate-500"
        }`}
        aria-hidden="true"
      >
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-extrabold text-slate-800">{label}</span>
        <span className="mt-0.5 block text-xs font-semibold leading-5 text-slate-500">{helper}</span>
      </span>
      {selected ? <CheckCircle2 size={16} className="ml-auto mt-0.5 shrink-0 text-ocean" aria-hidden="true" /> : null}
    </motion.button>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-start justify-between gap-3 text-sm font-semibold">
      <span className="text-slate-400">{label}</span>
      <span className="text-right text-slate-700">{value}</span>
    </p>
  );
}
