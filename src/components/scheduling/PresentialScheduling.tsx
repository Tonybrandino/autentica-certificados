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
import { AlertTriangle, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

import { ScheduleSuccess } from "./ScheduleSuccess";
import {
  DateSelector,
  FileField,
  LockedField,
  OrderDataItem,
  SectionHeading,
  TimeSlotGrid,
  controlClass,
  fieldLabelClass,
  formatSaleDate
} from "./SchedulingFields";

type AttachmentId = "identity" | "pis" | "cei" | "voter" | "cno";

const attachments: Array<{ id: AttachmentId; label: string; helper: string; required?: boolean }> = [
  { id: "identity", label: "Documento de identificação", helper: "CNH, RG, passaporte e etc.", required: true },
  { id: "pis", label: "Comprovante PIS", helper: "Se necessário" },
  { id: "cei", label: "Comprovante CEI/CAEPF", helper: "Se necessário" },
  { id: "voter", label: "Comprovante título de eleitor", helper: "Se necessário" },
  { id: "cno", label: "Comprovante CNO", helper: "Se necessário" }
];

export function PresentialScheduling({ order, now }: { order: OrderDraft; now: Date }) {
  const dates = useMemo(() => buildAvailableDates(now, { days: 20, allowSaturday: false, allowToday: false }), [now]);

  const [servicePointId, setServicePointId] = useState("");
  const [date, setDate] = useState(dates[0] ?? "");
  const [time, setTime] = useState("");
  const [files, setFiles] = useState<Record<string, string>>({});
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

  function changeFile(id: AttachmentId, fileName: string) {
    setFiles(current => ({ ...current, [id]: fileName }));
    clearError(id);
  }

  function schedule() {
    const nextErrors: Record<string, string> = {};

    if (!servicePointId) nextErrors.servicePoint = "Escolha o posto de atendimento.";
    if (!date || !dates.includes(date)) nextErrors.date = "Escolha uma data disponível na agenda.";
    if (!time) nextErrors.time = "Escolha um horário para o atendimento.";
    else if (isSlotTaken(date, time) || isSlotInPast(date, time, now)) {
      nextErrors.time = "Este horário não está mais disponível.";
    }
    if (!files.identity) nextErrors.identity = "Anexe o documento de identificação para continuar.";

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
        <div className="mt-3 rounded-2xl border border-lime-100 bg-white p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Pedido</p>
          <p className="mt-1 text-sm font-black text-ink">
            {order.orderNumber} · {order.productCode}
          </p>
        </div>
      </ScheduleSuccess>
    );
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Próximo passo"
        title="Agende seu atendimento presencial"
        description="Escolha o posto, a data e o horário da validação de identidade. Os anexos agilizam a conferência no balcão."
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

      <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
        <p className="text-sm font-black text-ink">
          <span className="text-trust">*</span> Anexe os arquivos, cada um referente ao campo determinado
        </p>
        <p className="mt-2 inline-flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[13px] font-bold leading-5 text-amber-800">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          Anexar os documentos não isenta a apresentação dos originais no momento do atendimento.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {attachments.map(attachment => (
            <FileField
              key={attachment.id}
              label={attachment.label}
              helper={attachment.helper}
              required={attachment.required}
              value={files[attachment.id] ?? ""}
              error={errors[attachment.id]}
              onChange={fileName => changeFile(attachment.id, fileName)}
            />
          ))}
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
