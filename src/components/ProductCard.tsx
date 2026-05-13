"use client";

import type { CertificateProduct } from "@/data/products";
import { motion } from "framer-motion";
import { ArrowRight, Check, FileBadge2 } from "lucide-react";
import { useState } from "react";

type ProductCardProps = {
  product: CertificateProduct;
  onBuy: (product: CertificateProduct, validity: string) => void;
};

export function ProductCard({ product, onBuy }: ProductCardProps) {
  const [validity, setValidity] = useState(product.validityOptions[0] ?? "12 meses");

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

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] font-black uppercase tracking-wide text-muted">Tipo</p>
          <p className="mt-1 text-sm font-black text-ink">{product.type}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] font-black uppercase tracking-wide text-muted">Armazenamento</p>
          <p className="mt-1 text-sm font-black text-ink">{product.storage}</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-muted">{product.description}</p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <label htmlFor={`validity-${product.id}`} className="text-[11px] font-black uppercase tracking-wide text-muted">
          Escolha a validade
        </label>
        <select
          id={`validity-${product.id}`}
          aria-label={`Selecionar validade do ${product.name}`}
          value={validity}
          onChange={(event) => setValidity(event.target.value)}
          className="focus-ring mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-ink"
        >
          {product.validityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
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
        <p className="mb-4 text-lg font-black text-ink">{product.pricePlaceholder}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <motion.button
            type="button"
            onClick={() => onBuy(product, validity)}
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


