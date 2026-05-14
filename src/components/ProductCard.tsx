"use client";

import type { CertificateProduct, ValidityStep } from "@/data/products";
import { motion } from "framer-motion";
import { ArrowRight, Check, FileBadge2 } from "lucide-react";

type ProductCardProps = {
  product: CertificateProduct;
  targetValidity: ValidityStep;
  onBuy: (product: CertificateProduct, validity: ValidityStep) => void;
};

function getAppliedValidity(product: CertificateProduct, targetValidity: ValidityStep): ValidityStep {
  const available = Object.keys(product.pricesByValidity)
    .map(Number)
    .sort((a, b) => a - b) as ValidityStep[];

  if (available.length === 0) {
    return 12;
  }

  const closestBelowTarget = [...available].reverse().find((months) => months <= targetValidity);
  return closestBelowTarget ?? available[0];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
    value
  );
}

export function ProductCard({ product, targetValidity, onBuy }: ProductCardProps) {
  const availableValidities = Object.keys(product.pricesByValidity)
    .map(Number)
    .sort((a, b) => a - b) as ValidityStep[];
  const appliedValidity = getAppliedValidity(product, targetValidity);
  const appliedPrice = product.pricesByValidity[appliedValidity] ?? 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -5, scale: 1.008 }}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover-lift hover:border-ocean/35 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-extrabold text-ocean">
            {product.badge}
          </span>
          <h3 className="mt-4 text-xl font-black tracking-tight text-ink sm:text-2xl">{product.name}</h3>
          <p className="mt-1 text-sm font-semibold text-muted">{product.audience}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ocean text-white transition group-hover:bg-[#006B9A]">
          <FileBadge2 size={21} aria-hidden="true" />
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-muted">{product.description}</p>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">A partir de</p>
        <p className="mt-2 flex items-end gap-2">
          <span className="text-4xl font-black leading-none text-ink">{formatCurrency(appliedPrice)}</span>
          <span className="pb-1 text-lg font-bold text-slate-500">/ {appliedValidity} m</span>
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-600">Validade aplicada: {appliedValidity} meses</p>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          Disponível em: {availableValidities.join(", ")} meses
        </p>
      </div>

      <ul className="mt-4 space-y-2">
        {product.benefits.map((benefit) => (
          <li key={benefit} className="flex gap-2 text-sm text-slate-700">
            <Check size={16} className="mt-0.5 shrink-0 text-trust" aria-hidden="true" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <div className="grid gap-2 sm:grid-cols-2">
          <motion.button
            type="button"
            onClick={() => onBuy(product, appliedValidity)}
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-ocean px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#006B9A]"
          >
            Comprar
            <ArrowRight size={16} aria-hidden="true" />
          </motion.button>
          <motion.a
            href="#certificados"
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            className="focus-ring inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-extrabold text-ink transition hover:border-ocean/40 hover:text-ocean"
          >
            Ver detalhes
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}
