"use client";

import type { OrderDraft } from "@/data/scheduling";
import { AUTOMATIC_ISSUANCE_URL } from "@/data/scheduling";
import { ExternalLink, PauseCircle, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { OrderDataItem, SectionHeading, formatSaleDate } from "./SchedulingFields";

const REDIRECT_SECONDS = 10;

const steps = [
  "Confirme seus dados no ambiente da autoridade certificadora.",
  "Autentique-se com o certificado anterior ainda válido.",
  "Baixe ou instale o novo certificado na mesma sessão."
];

export function AutomaticIssuance({ order }: { order: OrderDraft }) {
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    if (!autoRedirect) return;

    if (secondsLeft <= 0) {
      window.location.assign(AUTOMATIC_ISSUANCE_URL);
      return;
    }

    const timer = window.setTimeout(() => setSecondsLeft(current => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [autoRedirect, secondsLeft]);

  const progress = ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * 100;

  return (
    <div>
      <SectionHeading
        eyebrow="Próximo passo"
        title="Sua emissão automática está liberada"
        description="A emissão sem agendamento é concluída no ambiente da autoridade certificadora, com validação pelo certificado anterior."
      />

      <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Dados do pedido</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <OrderDataItem label="Pedido" value={order.orderNumber} />
          <OrderDataItem label="Tipo" value={order.productCode} />
          <OrderDataItem label="CPF/CNPJ" value={order.document} />
          <OrderDataItem label="Nome/Razão" value={order.holderName} />
          <OrderDataItem label="Data da venda" value={formatSaleDate(order.createdAt)} />
        </div>
      </div>

      <div className="mt-5 rounded-3xl border-2 border-lime-200 bg-[linear-gradient(135deg,rgba(126,208,56,0.2),rgba(255,255,255,0.96))] p-5 sm:p-6">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-trust text-white shadow-[0_16px_30px_rgba(92,175,24,0.26)]">
          <Zap size={22} strokeWidth={2.4} aria-hidden="true" />
        </span>

        <h3 className="mt-4 text-xl font-black text-ink">
          {autoRedirect
            ? `Você será redirecionado em ${secondsLeft}s`
            : "Redirecionamento pausado"}
        </h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          {autoRedirect
            ? "Estamos abrindo o ambiente de emissão online para concluir seu certificado agora mesmo."
            : "Quando quiser continuar, abra o ambiente de emissão online pelo botão abaixo."}
        </p>

        {autoRedirect && (
          <span className="mt-4 block h-1.5 overflow-hidden rounded-full bg-white" aria-hidden="true">
            <span
              className="block h-full rounded-full bg-trust transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </span>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={AUTOMATIC_ISSUANCE_URL}
            className="focus-ring inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-trust px-5 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_35px_rgba(92,175,24,0.24)] hover:bg-[#4e9f16]"
          >
            Ir para a emissão online
            <ExternalLink size={16} aria-hidden="true" />
          </a>
          {autoRedirect && (
            <button
              type="button"
              onClick={() => setAutoRedirect(false)}
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-lime-100 bg-white px-5 text-sm font-black text-ocean hover:bg-lime-50"
            >
              <PauseCircle size={16} aria-hidden="true" />
              Cancelar redirecionamento
            </button>
          )}
        </div>

        <p className="mt-4 break-all text-[11px] font-bold text-slate-500">{AUTOMATIC_ISSUANCE_URL}</p>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Como funciona</p>
        <ol className="mt-3 space-y-3">
          {steps.map((step, index) => (
            <li key={step} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ocean text-[11px] font-black text-white">
                {index + 1}
              </span>
              <span className="text-sm font-semibold leading-6 text-slate-600">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 inline-flex items-start gap-2 rounded-2xl border border-lime-100 bg-white p-3 text-[13px] font-bold leading-5 text-slate-600">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-ocean" aria-hidden="true" />
          Se a validação automática não for concluída, nossa equipe entra em contato para reagendar por videoconferência
          sem custo adicional.
        </p>
      </div>
    </div>
  );
}
