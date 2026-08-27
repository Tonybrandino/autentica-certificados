"use client";

import type { ValidationMethod } from "@/data/products";

import { AutomaticIssuance } from "./AutomaticIssuance";
import { PresentialScheduling } from "./PresentialScheduling";
import { VideoScheduling } from "./VideoScheduling";
import { useOrderDraft } from "./useOrderDraft";

type SchedulingPanelProps = {
  validation: ValidationMethod;
  productName: string;
  productCode: string;
  seed: string;
};

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
  const { order, now } = useOrderDraft({ validation, productName, productCode, seed });

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
