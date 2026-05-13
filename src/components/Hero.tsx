"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, LockKeyhole, RadioTower, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const trustBadges = [
  { label: "ICP-Brasil", icon: ShieldCheck },
  { label: "Validade jurídica", icon: BadgeCheck },
  { label: "Atendimento online", icon: RadioTower },
  { label: "Emissão segura", icon: LockKeyhole }
];

const rotatingWords = ["SEGURAN\u00C7A", "ACESSOS", "ASSINATURAS"];

export function Hero() {
  const [typedWord, setTypedWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = rotatingWords[wordIndex];
    const isWordComplete = typedWord === currentWord;
    const isWordEmpty = typedWord.length === 0;

    const delay = isDeleting ? 38 : 58;

    const timer = setTimeout(
      () => {
        if (!isDeleting && !isWordComplete) {
          setTypedWord(currentWord.slice(0, typedWord.length + 1));
          return;
        }

        if (!isDeleting && isWordComplete) {
          setIsDeleting(true);
          return;
        }

        if (isDeleting && !isWordEmpty) {
          setTypedWord(currentWord.slice(0, typedWord.length - 1));
          return;
        }

        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % rotatingWords.length);
      },
      !isDeleting && isWordComplete ? 620 : isDeleting && isWordEmpty ? 120 : delay
    );

    return () => clearTimeout(timer);
  }, [typedWord, isDeleting, wordIndex]);

  return (
    <section className="relative pt-24 sm:pt-28 lg:pt-32">
      <div className="subtle-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div className="section-shell pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto max-w-5xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-ocean/25 bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ocean shadow-sm sm:px-4 sm:py-2 sm:text-xs">
            Certificação Digital ICP-Brasil
          </span>
          <h1 className="mt-6 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-6xl">
            Gere mais{" "}
            <span className="text-ocean" aria-live="polite">
              {typedWord}
              <span className="animate-pulse text-ocean">|</span>
            </span>{" "}
            com
            <span className="block">Certificado Digital ICP-Brasil</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-muted sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
            Escolha entre e-CPF, e-CNPJ, NF-e e certificado em nuvem. Compare o modelo ideal, selecione a validade e
            finalize com o método de validação em um fluxo simples.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="mt-7 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row"
          >
            <motion.a
              href="#certificados"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-ocean px-6 py-3 text-sm font-extrabold text-white shadow-soft smooth-ease hover:bg-[#006B9A] sm:px-7 sm:py-3.5"
            >
              Escolher certificado
              <ArrowRight size={17} aria-hidden="true" />
            </motion.a>
            <motion.a
              href="#assistente"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className="focus-ring inline-flex items-center justify-center rounded-full border border-line bg-white px-6 py-3 text-sm font-extrabold text-ink smooth-ease hover:border-ocean/50 hover:text-ocean sm:px-7 sm:py-3.5"
            >
              Descobrir modelo ideal
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {trustBadges.map(({ label, icon: Icon }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.35 + index * 0.08 }}
              whileHover={{ y: -2 }}
              className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover-lift"
            >
              <Icon size={16} className="text-trust" aria-hidden="true" />
              <span>{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


