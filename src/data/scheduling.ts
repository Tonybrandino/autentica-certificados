import type { ValidationMethod } from "./products";

/** Emissao automatica e concluida no ambiente da AC parceira. */
export const AUTOMATIC_ISSUANCE_URL = "https://emissao-online.soluti.com.br/arassinarcd";

/** Chave usada para levar os dados do pedido do checkout ate a confirmacao. */
export const ORDER_DRAFT_STORAGE_KEY = "okay:pedido-em-andamento";

export type OrderDraft = {
  orderNumber: string;
  createdAt: string;
  holderName: string;
  document: string;
  productName: string;
  productCode: string;
  validation: ValidationMethod;
  email: string;
  phone: string;
};

export type ServicePoint = {
  id: string;
  city: string;
  state: string;
  street: string;
  district: string;
};

/**
 * Rede de postos de atendimento presencial.
 * Substituir pela lista oficial da AC quando a integracao estiver disponivel.
 */
export const servicePoints: ServicePoint[] = [
  { id: "birigui-centro", city: "Birigui", state: "SP", street: "Rua Bento da Cruz, 838", district: "Centro" },
  { id: "aracatuba-centro", city: "Araçatuba", state: "SP", street: "Rua Floriano Peixoto, 512", district: "Centro" },
  { id: "penapolis-centro", city: "Penápolis", state: "SP", street: "Av. Antônio de Almeida, 1.045", district: "Centro" },
  { id: "sjrpreto-boa-vista", city: "São José do Rio Preto", state: "SP", street: "Rua Bernardino de Campos, 2.310", district: "Boa Vista" },
  { id: "bauru-centro", city: "Bauru", state: "SP", street: "Rua Gustavo Maciel, 640", district: "Centro" },
  { id: "sp-paulista", city: "São Paulo", state: "SP", street: "Av. Paulista, 1.374 - Conj. 1108", district: "Bela Vista" }
];

export function formatServicePoint(point: ServicePoint) {
  return `${point.city}/${point.state}, ${point.street}, Bairro: ${point.district}`;
}

type SlotRange = {
  start: string;
  end: string;
  stepMinutes: number;
};

const presentialRanges: SlotRange[] = [
  { start: "09:00", end: "11:40", stepMinutes: 20 },
  { start: "13:00", end: "17:40", stepMinutes: 20 }
];

const videoRanges: SlotRange[] = [{ start: "08:00", end: "18:45", stepMinutes: 15 }];

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

function toTimeLabel(minutes: number) {
  const hours = Math.floor(minutes / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function buildSlots(ranges: SlotRange[]) {
  return ranges.flatMap(range => {
    const slots: string[] = [];
    for (let minute = toMinutes(range.start); minute <= toMinutes(range.end); minute += range.stepMinutes) {
      slots.push(toTimeLabel(minute));
    }
    return slots;
  });
}

export const presentialTimeSlots = buildSlots(presentialRanges);
export const videoTimeSlots = buildSlots(videoRanges);

/** Antecedencia minima entre o agendamento e o inicio do atendimento. */
export const MIN_LEAD_MINUTES = 60;

export function toISODate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromISODate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

export function buildAvailableDates(
  reference: Date,
  { days, allowSaturday, allowToday }: { days: number; allowSaturday: boolean; allowToday: boolean }
) {
  const dates: string[] = [];
  const cursor = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());

  if (!allowToday) {
    cursor.setDate(cursor.getDate() + 1);
  }

  while (dates.length < days) {
    const weekday = cursor.getDay();
    const isSunday = weekday === 0;
    const isSaturday = weekday === 6;

    if (!isSunday && (allowSaturday || !isSaturday)) {
      dates.push(toISODate(cursor));
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

/**
 * Agenda simulada: marca horarios como ocupados de forma estavel por data,
 * evitando divergencia entre servidor e cliente.
 */
export function isSlotTaken(dateISO: string, time: string) {
  const seed = `${dateISO}${time}`;
  let hash = 7;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 9973;
  }

  return hash % 7 === 0;
}

export function isSlotInPast(dateISO: string, time: string, now: Date) {
  if (dateISO !== toISODate(now)) return false;

  const limit = now.getHours() * 60 + now.getMinutes() + MIN_LEAD_MINUTES;
  return toMinutes(time) <= limit;
}

const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long"
});

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit"
});

export function formatLongDate(dateISO: string) {
  return longDateFormatter.format(fromISODate(dateISO));
}

export function formatShortDate(dateISO: string) {
  return shortDateFormatter.format(fromISODate(dateISO)).replace(".", "");
}

export function formatDayLabel(dateISO: string, now: Date) {
  const today = toISODate(now);
  if (dateISO === today) return "Hoje";

  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  if (dateISO === toISODate(tomorrow)) return "Amanhã";

  return formatShortDate(dateISO);
}

export function formatBrDate(dateISO: string) {
  const [year, month, day] = dateISO.split("-");
  return `${day}/${month}/${year}`;
}

/** Numero de pedido estavel a partir de uma semente (usado quando nao ha dados na sessao). */
export function buildOrderNumber(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 900000;
  }

  return String(100000 + hash);
}

/** Aplica mascara de CPF ou CNPJ quando o valor tem a quantidade esperada de digitos. */
export function formatDocument(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  if (digits.length === 14) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }

  return value.trim();
}
