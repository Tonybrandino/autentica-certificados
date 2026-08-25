"use client";

import type { OrderDraft } from "@/data/scheduling";
import { buildAvailableDates, isSlotInPast, isSlotTaken, videoTimeSlots } from "@/data/scheduling";
import { Check, KeyRound, Video } from "lucide-react";
import { useMemo, useState } from "react";

import { ScheduleSuccess } from "./ScheduleSuccess";
import { DateSelector, OrderDataItem, SectionHeading, TimeSlotGrid, formatSaleDate } from "./SchedulingFields";

const videoChecklist = [
  "Documento de identificação original em mãos (o mesmo enviado no cadastro).",
  "Ambiente iluminado, sem boné, óculos escuros ou máscara.",
  "Conexão estável com câmera e microfone liberados no navegador."
];

function Stepper() {
  return (
    <div className="rounded-3xl border border-lime-100 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-trust text-white">
          <Check size={18} strokeWidth={3} aria-hidden="true" />
        </span>
        <span className="h-1 flex-1 rounded-full bg-[linear-gradient(90deg,#5caf18_0%,#7ed038_100%)]" aria-hidden="true" />
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ocean text-sm font-black text-white">
          2
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-ink">Senha</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-trust">
            <KeyRound size={12} aria-hidden="true" />
            Concluído
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-ink">Atendimento</p>
          <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-ocean">Etapa atual</p>
        </div>
      </div>
    </div>
  );
}

export function VideoScheduling({ order, now }: { order: OrderDraft; now: Date }) {
  const dates = useMemo(() => buildAvailableDates(now, { days: 20, allowSaturday: true, allowToday: true }), [now]);

  const [date, setDate] = useState(dates[0] ?? "");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);

  function clearError(field: string) {
    setErrors(current => {
      if (!current[field]) return current;

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function changeDate(value: string) {
    setDate(value);
    setTime("");
    clearError("date");
    clearError("time");
  }

  function schedule() {
    const nextErrors: Record<string, string> = {};

    if (!date || !dates.includes(date)) nextErrors.date = "Escolha uma data disponível na agenda.";
    if (!time) nextErrors.time = "Escolha um horário para a videoconferência.";
    else if (isSlotTaken(date, time) || isSlotInPast(date, time, now)) {
      nextErrors.time = "Este horário não está mais disponível.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <ScheduleSuccess
        title="Sua videoconferência está agendada"
        dateISO={date}
        time={time}
        place="Atendimento online por videoconferência com validação de identidade"
        mode="video"
        note={`O link da sala será enviado para ${order.email || "o e-mail cadastrado"} e para o WhatsApp do pedido. Entre com alguns minutos de antecedência.`}
        onEdit={() => setConfirmed(false)}
      >
        <div className="mt-3 rounded-2xl border border-lime-100 bg-white p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Leve para a chamada</p>
          <ul className="mt-2 space-y-2">
            {videoChecklist.map(item => (
              <li key={item} className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-600">
                <Check size={15} className="mt-1 shrink-0 text-trust" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </ScheduleSuccess>
    );
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Próximo passo"
        title="Agende sua videoconferência"
        description="Selecione a data e a hora em que você gostaria de fazer a validação por videoconferência."
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Stepper />

          <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Dados do atendimento</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <OrderDataItem label="Pedido" value={order.orderNumber} />
              <OrderDataItem label="Tipo" value={order.productCode} />
              <OrderDataItem label="CPF/CNPJ" value={order.document} />
              <OrderDataItem label="Nome/Razão" value={order.holderName} />
              <OrderDataItem label="Data da venda" value={formatSaleDate(order.createdAt)} />
            </div>
          </div>

          <div className="rounded-3xl border border-lime-100 bg-lime-50/70 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-black text-ocean">
              <KeyRound size={15} aria-hidden="true" />
              Senha já criada
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              A senha do certificado foi definida durante o checkout. Guarde-a: ela será pedida na emissão e não pode ser
              recuperada por nossa equipe.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
          <DateSelector dates={dates} value={date} now={now} onChange={changeDate} error={errors.date} />

          <div className="mt-5 border-t border-slate-200 pt-5">
            <TimeSlotGrid
              slots={videoTimeSlots}
              dateISO={date}
              value={time}
              now={now}
              columns="grid-cols-3 sm:grid-cols-5 lg:grid-cols-7"
              onChange={value => {
                setTime(value);
                clearError("time");
              }}
              error={errors.time}
            />
          </div>

          <button
            type="button"
            onClick={schedule}
            className="focus-ring mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-trust px-5 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_35px_rgba(92,175,24,0.24)] hover:bg-[#4e9f16]"
          >
            <Video size={16} aria-hidden="true" />
            Agendar videoconferência
          </button>
        </div>
      </div>
    </div>
  );
}
