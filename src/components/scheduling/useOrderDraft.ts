"use client";

import type { ValidationMethod } from "@/data/products";
import type { OrderDraft } from "@/data/scheduling";
import { ORDER_DRAFT_STORAGE_KEY, buildOrderNumber, formatDocument } from "@/data/scheduling";
import { useMemo, useSyncExternalStore } from "react";

type OrderDraftFallback = {
  validation: ValidationMethod;
  productName: string;
  productCode: string;
  seed: string;
};

/**
 * A sessao do navegador e o relogio sao lidos como fontes externas: no servidor
 * nao ha pedido nem hora, e apos a hidratacao os dados reais assumem o lugar.
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

export function useOrderDraft({ validation, productName, productCode, seed }: OrderDraftFallback) {
  const raw = useSyncExternalStore(subscribe, readOrderDraftRaw, readOrderDraftOnServer);
  const minuteBucket = useSyncExternalStore(subscribe, readMinuteBucket, readMinuteBucketOnServer);

  const now = useMemo(() => (minuteBucket === 0 ? null : new Date(minuteBucket * 60_000)), [minuteBucket]);
  const stored = useMemo(() => parseOrderDraft(raw), [raw]);

  const order = useMemo<OrderDraft>(
    () => ({
      orderNumber: stored?.orderNumber || buildOrderNumber(seed),
      createdAt: stored?.createdAt || (now ?? new Date(0)).toISOString(),
      holderName: stored?.holderName || "Titular do pedido",
      document: stored?.document ? formatDocument(stored.document) : "Não informado",
      productName: stored?.productName || productName,
      productCode: stored?.productCode || productCode,
      validation,
      email: stored?.email || "",
      phone: stored?.phone || ""
    }),
    [now, productCode, productName, seed, stored, validation]
  );

  return { order, now, hasDraft: Boolean(stored?.holderName) };
}
