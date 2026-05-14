"use client";

import { ProductCard } from "@/components/ProductCard";
import type { CertificateProduct, CustomerProfile, ValidationMethod, ValidityStep } from "@/data/products";
import { products, validationMethods, validitySteps } from "@/data/products";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useMemo, useState } from "react";

type SelectionState = {
  product: CertificateProduct;
  validity: ValidityStep;
};

export function ProductGrid() {
  const [profile, setProfile] = useState<CustomerProfile>("pf");
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [validation, setValidation] = useState<ValidationMethod>("video");
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [validityIndex, setValidityIndex] = useState(0);

  const filteredProducts = useMemo(
    () => products.filter((item) => item.profile === profile && !(profile === "pj" && item.id === "nfe")),
    [profile]
  );
  const selectedValidity = validitySteps[validityIndex] ?? 12;

  function handleBuy(product: CertificateProduct, validity: ValidityStep) {
    setSelection({ product, validity });
    setValidation("video");
    setIsValidationOpen(true);
  }

  function closeValidation() {
    setIsValidationOpen(false);
  }

  return (
    <section id="certificados" className="bg-white py-20 sm:py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-ocean">Escolha guiada</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Defina perfil, modelo e validação em poucos cliques
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Selecione o perfil, ajuste a validade no slider e veja os preços atualizados automaticamente em cada
            certificado.
          </p>
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-md items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setProfile("pf")}
            className={`focus-ring min-w-0 flex-1 rounded-full px-3 py-2.5 text-xs font-extrabold transition sm:px-4 sm:text-sm ${
              profile === "pf" ? "bg-ocean text-white" : "text-ink hover:bg-slate-100"
            }`}
          >
            Pessoa Física
          </button>
          <button
            type="button"
            onClick={() => setProfile("pj")}
            className={`focus-ring min-w-0 flex-1 rounded-full px-3 py-2.5 text-xs font-extrabold transition sm:px-4 sm:text-sm ${
              profile === "pj" ? "bg-ocean text-white" : "text-ink hover:bg-slate-100"
            }`}
          >
            Pessoa Jurídica
          </button>
        </div>

        <div className="mx-auto mt-6 w-[calc(100%-1rem)] max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:w-full">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-slate-700">Validade desejada</p>
            <p className="text-2xl font-black text-ink">{selectedValidity} meses</p>
          </div>
          <div className="mt-4 px-3 sm:px-4">
            <input
              type="range"
              min={0}
              max={validitySteps.length - 1}
              step={1}
              value={validityIndex}
              onChange={(event) => setValidityIndex(Number(event.target.value))}
              className="validity-slider w-full cursor-pointer"
              aria-label="Selecionar validade desejada"
            />
            <div className="relative mt-2 h-8 text-sm font-semibold text-slate-500">
              {validitySteps.map((months, index) => {
                const lastIndex = validitySteps.length - 1;
                const position = `${(index / lastIndex) * 100}%`;

                if (index === 0) {
                  return (
                    <span key={months} className="absolute left-0 whitespace-nowrap text-left">
                      {months} m
                    </span>
                  );
                }

                if (index === lastIndex) {
                  return (
                    <span key={months} className="absolute right-0 whitespace-nowrap text-right">
                      {months} m
                    </span>
                  );
                }

                return (
                  <span
                    key={months}
                    className="absolute -translate-x-1/2 whitespace-nowrap text-center"
                    style={{ left: position }}
                  >
                    {months} m
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={profile}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                targetValidity={selectedValidity}
                onBuy={handleBuy}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isValidationOpen && selection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end bg-slate-900/45 p-3 sm:items-center sm:justify-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="validation-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-lift sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-ocean">Etapa 3</p>
                  <h3 id="validation-title" className="mt-2 text-xl font-black text-ink sm:text-2xl">
                    Escolha o método de validação
                  </h3>
                  <p className="mt-2 break-words text-sm leading-6 text-muted">
                    Produto: {selection.product.name} | Validade: {selection.validity} meses
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeValidation}
                  className="focus-ring rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                  aria-label="Fechar seletor de validação"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-5 grid gap-3">
                {validationMethods.map((option) => (
                  <motion.label
                    key={option.id}
                    whileHover={{ y: -1 }}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                      validation === option.id ? "border-ocean bg-sky-50" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="validation-method"
                      value={option.id}
                      checked={validation === option.id}
                      onChange={() => setValidation(option.id)}
                      className="mt-1 h-4 w-4 border-slate-300 text-ocean focus:ring-ocean"
                    />
                    <span>
                      <span className="block text-sm font-black text-ink">{option.title}</span>
                      <span className="mt-1 block text-sm text-slate-600">{option.subtitle}</span>
                    </span>
                  </motion.label>
                ))}
              </div>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeValidation}
                  className="focus-ring rounded-full border border-slate-200 px-4 py-3 text-sm font-extrabold text-ink hover:bg-slate-100"
                >
                  Ajustar escolha
                </button>
                <a
                  href="#comprar"
                  onClick={closeValidation}
                  className="focus-ring inline-flex items-center justify-center rounded-full bg-ocean px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#006B9A]"
                >
                  Continuar compra
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
