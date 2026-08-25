"use client";

import { formatBrDate, formatLongDate } from "@/data/scheduling";
import { CalendarCheck, Clock, MapPin, PencilLine, Video } from "lucide-react";
import type { ReactNode } from "react";

export function ScheduleSuccess({
  title,
  dateISO,
  time,
  place,
  mode,
  note,
  onEdit,
  children
}: {
  title: string;
  dateISO: string;
  time: string;
  place?: string;
  mode: "presencial" | "video";
  note: string;
  onEdit: () => void;
  children?: ReactNode;
}) {
  const PlaceIcon = mode === "presencial" ? MapPin : Video;

  return (
    <div className="rounded-3xl border-2 border-trust bg-[linear-gradient(135deg,rgba(126,208,56,0.22),rgba(255,255,255,0.96))] p-5 sm:p-7">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-trust text-white shadow-[0_16px_30px_rgba(92,175,24,0.26)]">
        <CalendarCheck size={24} strokeWidth={2.4} aria-hidden="true" />
      </span>
      <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ocean">Agendamento confirmado</p>
      <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">{title}</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-lime-100 bg-white p-4">
          <p className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
            <CalendarCheck size={13} className="text-ocean" aria-hidden="true" />
            Data
          </p>
          <p className="mt-1 text-lg font-black capitalize text-ink">{formatLongDate(dateISO)}</p>
          <p className="text-sm font-bold text-slate-500">{formatBrDate(dateISO)}</p>
        </div>
        <div className="rounded-2xl border border-lime-100 bg-white p-4">
          <p className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
            <Clock size={13} className="text-ocean" aria-hidden="true" />
            Horário
          </p>
          <p className="mt-1 text-lg font-black text-ink">{time}</p>
          <p className="text-sm font-bold text-slate-500">Horário de Brasília - DF</p>
        </div>
        {place && (
          <div className="rounded-2xl border border-lime-100 bg-white p-4 sm:col-span-2">
            <p className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
              <PlaceIcon size={13} className="text-ocean" aria-hidden="true" />
              {mode === "presencial" ? "Posto de atendimento" : "Atendimento"}
            </p>
            <p className="mt-1 text-sm font-black leading-6 text-ink">{place}</p>
          </div>
        )}
      </div>

      {children}

      <p className="mt-5 rounded-2xl border border-lime-100 bg-white p-4 text-sm font-semibold leading-6 text-slate-600">
        {note}
      </p>

      <button
        type="button"
        onClick={onEdit}
        className="focus-ring mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-lime-100 bg-white px-5 text-sm font-black text-ocean hover:bg-lime-50"
      >
        <PencilLine size={16} aria-hidden="true" />
        Alterar agendamento
      </button>
    </div>
  );
}
