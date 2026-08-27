"use client";

import type { OrderDraft } from "@/data/scheduling";
import {
  buildAvailableDates,
  formatServicePoint,
  isSlotInPast,
  isSlotTaken,
  presentialTimeSlots,
  servicePoints
} from "@/data/scheduling";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";

import { ScheduleSuccess } from "./ScheduleSuccess";
import {
  DateSelector,
  LockedField,
  OrderDataItem,
  SectionHeading,
  TimeSlotGrid,
  controlClass,
  fieldLabelClass,
  formatSaleDate
} from "./SchedulingFields";

export function PresentialScheduling({ order, now }: { order: OrderDraft; now: Date }) {
  const dates = useMemo(() => buildAvailableDates(now, { days: 20, allowSaturday: false, allowToday: false }), [now]);

  const [servicePointId, setServicePointId] = useState("");
  const [date, setDate] = useState(dates[0] ?? "");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);

  const selectedPoint = servicePoints.find(point => point.id === servicePointId) ?? null;

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

    if (!servicePointId) nextErrors.servicePoint = "Escolha o posto de atendimento.";
    if (!date || !dates.includes(date)) nextErrors.date = "Escolha uma data disponível na agenda.";
    if (!time) nextErrors.time = "Escolha um horário para o atendimento.";
    else if (isSlotTaken(date, time) || isSlotInPast(date, time, now)) {
      nextErrors.time = "Este horário não está mais disponível.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setConfirmed(true);
  }

  if (confirmed && selectedPoint) {
    return (
      <ScheduleSuccess
        title="Seu atendimento presencial está agendado"
        dateISO={date}
        time={time}
        place={formatServicePoint(selectedPoint)}
        mode="presencial"
        note="Leve os documentos originais no dia do atendimento. Chegue com 10 minutos de antecedência e apresente o número do pedido na recepção."
        onEdit={() => setConfirmed(false)}
      >
        <div className="mt-3 grid gap-4 rounded-2xl border border-lime-100 bg-white p-4 sm:grid-cols-3">
          <OrderDataItem label="Nome/Razão" value={order.holderName} />
          <OrderDataItem label="Pedido" value={order.orderNumber} />
          <OrderDataItem label="Tipo" value={order.productCode} />
        </div>
      </ScheduleSuccess>
    );
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Próximo passo"
        title="Agende seu atendimento presencial"
        description="Escolha o posto, a data e o horário da validação de identidade. Leve os documentos originais no dia do atendimento."
      />

      <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Dados do atendimento</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <OrderDataItem label="Pedido" value={order.orderNumber} />
          <OrderDataItem label="Tipo" value={order.productCode} />
          <OrderDataItem label="CPF/CNPJ" value={order.document} />
          <OrderDataItem label="Nome/Razão" value={order.holderName} />
          <OrderDataItem label="Data da venda" value={formatSaleDate(order.createdAt)} />
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <LockedField label="Certificado contratado" value={order.productName} />

          <label className={`${fieldLabelClass} sm:col-span-2`}>
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-ocean" aria-hidden="true" />
              Posto de atendimento
              <span className="text-trust">*</span>
            </span>
            <select
              value={servicePointId}
              aria-invalid={Boolean(errors.servicePoint)}
              onChange={event => {
                setServicePointId(event.target.value);
                clearError("servicePoint");
              }}
              className={`${controlClass} ${errors.servicePoint ? "border-red-400 bg-red-50/40" : "border-slate-200"}`}
            >
              <option value="">Selecione o posto mais próximo</option>
              {servicePoints.map(point => (
                <option key={point.id} value={point.id}>
                  {formatServicePoint(point)}
                </option>
              ))}
            </select>
            {errors.servicePoint && (
              <span className="mt-2 block text-[11px] font-extrabold normal-case tracking-normal text-red-600">
                {errors.servicePoint}
              </span>
            )}
          </label>
        </div>

        <div className="mt-5 border-t border-slate-200 pt-5">
          <DateSelector dates={dates} value={date} now={now} onChange={changeDate} error={errors.date} />
        </div>

        <div className="mt-5 border-t border-slate-200 pt-5">
          <TimeSlotGrid
            slots={presentialTimeSlots}
            dateISO={date}
            value={time}
            now={now}
            columns="grid-cols-3 sm:grid-cols-5"
            onChange={value => {
              setTime(value);
              clearError("time");
            }}
            error={errors.time}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={schedule}
        className="focus-ring mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-trust px-5 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_35px_rgba(92,175,24,0.24)] hover:bg-[#4e9f16]"
      >
        Agendar atendimento
      </button>
    </div>
  );
}
