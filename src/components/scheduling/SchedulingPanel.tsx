"use client";

import type { ValidationMethod } from "@/data/products";
import type { OrderDraft } from "@/data/scheduling";
import { ORDER_DRAFT_STORAGE_KEY, buildOrderNumber, formatDocument } from "@/data/scheduling";
import { useMemo, useSyncExternalStore } from "react";

import { AutomaticIssuance } from "./AutomaticIssuance";
import { PresentialScheduling } from "./PresentialScheduling";
import { VideoScheduling } from "./VideoScheduling";

type SchedulingPanelProps = {
  validation: ValidationMethod;
  productName: string;
  productCode: string;
  seed: string;
};

/**
 * A sessao do navegador e o relogio sao lidos como fontes externas: no servidor
 * renderizamos o esqueleto e, apos a hidratacao, a agenda real assume o lugar.
 */
function subscribe() {
  return () => {};
}

function readOrderDraftRaw() {
  try {
    return window.sessionStorage.getItem(ORDER_DRAFT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function readOrderDraftOnServer(): string | null {
  return null;
}

function readMinuteBucket() {
  return Math.floor(Date.now() / 60_000);
}

function readMinuteBucketOnServer() {
  return 0;
}

function parseOrderDraft(raw: string | null): Partial<OrderDraft> | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<OrderDraft>;
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

function SchedulingSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden="true">
      <div className="h-6 w-56 rounded-full bg-slate-100" />
      <div className="h-24 rounded-3xl bg-slate-100" />
      <div className="h-40 rounded-3xl bg-slate-100" />
    </div>
  );
}

export function SchedulingPanel({ validation, productName, productCode, seed }: SchedulingPanelProps) {
  const raw = useSyncExternalStore(subscribe, readOrderDraftRaw, readOrderDraftOnServer);
  const minuteBucket = useSyncExternalStore(subscribe, readMinuteBucket, readMinuteBucketOnServer);

  const now = useMemo(() => (minuteBucket === 0 ? null : new Date(minuteBucket * 60_000)), [minuteBucket]);

  const order = useMemo<OrderDraft>(() => {
    const stored = parseOrderDraft(raw);

    return {
      orderNumber: stored?.orderNumber || buildOrderNumber(seed),
      createdAt: stored?.createdAt || (now ?? new Date(0)).toISOString(),
      holderName: stored?.holderName || "Titular do pedido",
      document: stored?.document ? formatDocument(stored.document) : "Não informado",
      productName: stored?.productName || productName,
      productCode: stored?.productCode || productCode,
      validation,
      email: stored?.email || "",
      phone: stored?.phone || ""
    };
  }, [now, productCode, productName, raw, seed, validation]);

  return (
    <div className="rounded-3xl border border-lime-100 bg-white p-5 shadow-lift sm:p-7 lg:p-8">
      {now === null ? (
        <SchedulingSkeleton />
      ) : validation === "renovacao" ? (
        <AutomaticIssuance order={order} />
      ) : validation === "presencial" ? (
        <PresentialScheduling order={order} now={now} />
      ) : (
        <VideoScheduling order={order} now={now} />
      )}
    </div>
  );
}
