"use client";

import {
  formatBrDate,
  formatDayLabel,
  formatLongDate,
  isSlotInPast,
  isSlotTaken
} from "@/data/scheduling";
import { CalendarDays, Clock, Lock } from "lucide-react";

export const fieldLabelClass = "text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500";
export const controlClass =
  "focus-ring mt-2 h-12 w-full rounded-xl border bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-700";

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-black text-ink">{title}</h2>
      {description && <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{description}</p>}
    </div>
  );
}

export function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${fieldLabelClass} sm:col-span-2`}>
      <span>{label}</span>
      <span className="mt-2 flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-100/70 px-3">
        <span className="truncate text-sm font-black normal-case tracking-normal text-slate-700">{value}</span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-ocean">
          <Lock size={11} aria-hidden="true" />
          Do pedido
        </span>
      </span>
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <span className="mt-2 block text-[11px] font-extrabold normal-case tracking-normal text-red-600">{message}</span>
  );
}

export function DateSelector({
  dates,
  value,
  now,
  onChange,
  error
}: {
  dates: string[];
  value: string;
  now: Date;
  onChange: (dateISO: string) => void;
  error?: string;
}) {
  const quickDates = dates.slice(0, 6);
  const min = dates[0] ?? "";
  const max = dates[dates.length - 1] ?? "";

  return (
    <div>
      <label className={fieldLabelClass}>
        <span className="flex items-center gap-2">
          <CalendarDays size={14} className="text-ocean" aria-hidden="true" />
          Selecione a data do agendamento
        </span>
        <input
          type="date"
          value={value}
          min={min}
          max={max}
          aria-invalid={Boolean(error)}
          onChange={event => onChange(event.target.value)}
          className={`${controlClass} ${error ? "border-red-400 bg-red-50/40" : "border-slate-200"}`}
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        {quickDates.map(date => {
          const active = date === value;

          return (
            <button
              key={date}
              type="button"
              onClick={() => onChange(date)}
              aria-pressed={active}
              className={`focus-ring rounded-full border px-3 py-2 text-xs font-black capitalize transition ${
                active
                  ? "border-ocean bg-ocean text-white shadow-[0_10px_22px_rgba(63,127,18,0.22)]"
                  : "border-slate-200 bg-white text-slate-600 hover:border-lime-300 hover:bg-lime-50"
              }`}
            >
              {formatDayLabel(date, now)}
            </button>
          );
        })}
      </div>

      {value && !error && <p className="mt-3 text-sm font-bold capitalize text-slate-600">{formatLongDate(value)}</p>}
      <FieldError message={error} />
    </div>
  );
}

export function TimeSlotGrid({
  slots,
  dateISO,
  value,
  now,
  columns,
  onChange,
  error
}: {
  slots: string[];
  dateISO: string;
  value: string;
  now: Date;
  columns: string;
  onChange: (time: string) => void;
  error?: string;
}) {
  const available = slots.filter(slot => !isSlotTaken(dateISO, slot) && !isSlotInPast(dateISO, slot, now));

  return (
    <div>
      <p className={fieldLabelClass}>Selecione um horário</p>

      {available.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-800">
          Não há horários disponíveis nesta data. Escolha outro dia para continuar.
        </p>
      ) : (
        <div className={`mt-3 grid gap-2 ${columns}`}>
          {slots.map(slot => {
            const taken = isSlotTaken(dateISO, slot);
            const past = isSlotInPast(dateISO, slot, now);
            const disabled = taken || past;
            const active = value === slot;

            return (
              <button
                key={slot}
                type="button"
                disabled={disabled}
                onClick={() => onChange(slot)}
                aria-pressed={active}
                title={taken ? "Horário já reservado" : past ? "Horário indisponível para hoje" : undefined}
                className={`focus-ring h-10 rounded-xl border text-sm font-black transition ${
                  disabled
                    ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                    : active
                      ? "border-trust bg-trust text-white shadow-[0_12px_26px_rgba(92,175,24,0.26)]"
                      : "border-slate-200 bg-white text-slate-700 hover:border-lime-300 hover:bg-lime-50"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-3 inline-flex items-center gap-2 text-[11px] font-bold text-slate-500">
        <Clock size={13} className="text-ocean" aria-hidden="true" />
        Horário de Brasília - DF
      </p>
      <FieldError message={error} />
    </div>
  );
}

export function OrderDataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-slate-800" title={value}>
        {value}
      </p>
    </div>
  );
}

export function formatSaleDate(createdAt: string) {
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return "--/--/----";

  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return formatBrDate(`${parsed.getFullYear()}-${month}-${day}`);
}
