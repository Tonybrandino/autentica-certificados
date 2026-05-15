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

const rotatingWords = ["ASSINATURAS", "SEGURAN\u00C7A", "ACESSOS"];

function HeroAssinatura() {
  return (
    <div className="hero-sign" aria-hidden="true">
      <div className="hero-sign-doc">
        <div className="hero-sign-doc-head">
          <div>
            <span className="hero-sign-doc-label">Contrato.pdf · 2 páginas</span>
            <h3 className="hero-sign-doc-title">Prestação de Serviços</h3>
          </div>
          <span className="hero-sign-status">
            <span className="hero-sign-status-pending">
              <span className="dot-pulse" />
              Aguardando
            </span>
            <span className="hero-sign-status-signed">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12l5 5L20 6" />
              </svg>
              Assinado
            </span>
          </span>
        </div>

        <div className="hero-sign-doc-body">
          <div className="hero-sign-doc-lines">
            <span style={{ width: "92%" }} />
            <span style={{ width: "78%" }} />
            <span style={{ width: "85%" }} />
            <span style={{ width: "63%" }} />
            <span style={{ width: "88%" }} />
            <span style={{ width: "72%" }} />
          </div>

          <div className="hero-sign-stamp">
            <span className="hero-sign-stamp-ring">
              <svg viewBox="0 0 120 120">
                <defs>
                  <path id="stamp-circ" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
                </defs>
                <text fontFamily="var(--font-mono)" fontSize="8.5" letterSpacing="2.4" fill="currentColor">
                  <textPath href="#stamp-circ">ICP-BRASIL · VALIDADE JURÍDICA · ICP-BRASIL · </textPath>
                </text>
              </svg>
            </span>
            <span className="hero-sign-stamp-core">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12l5 5L20 6" />
              </svg>
            </span>
          </div>

          <div className="hero-sign-signature">
            <span className="hero-sign-signature-name">Marina A. Cordeiro</span>
            <span className="hero-sign-signature-line" />
            <span className="hero-sign-signature-meta">14/05/2026 · 14:32 · SHA-256 8a2c...1d28</span>
          </div>
        </div>

        <div className="hero-sign-btnrow">
          <span className="hero-sign-btn">
            <span className="hero-sign-btn-pen">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 4l6 6-9 9H5v-6z" />
                <path d="M13 5l6 6" />
              </svg>
            </span>
            <span className="hero-sign-btn-label">Assinar com certificado</span>
            <span className="hero-sign-btn-ripple" />
          </span>
        </div>

        <svg className="hero-sign-cursor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 3 L5 19 L9.5 15 L12 21 L14.5 20 L12 14 L18 14 Z"
            fill="white"
            stroke="#111"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export function Hero() {
  const [typedWord, setTypedWord] = useState(rotatingWords[0]);
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

        const nextIndex = (wordIndex + 1) % rotatingWords.length;
        setIsDeleting(false);
        setWordIndex(nextIndex);
        setTypedWord(rotatingWords[nextIndex].slice(0, 1));
      },
      !isDeleting && isWordComplete ? 900 : isDeleting && isWordEmpty ? 120 : delay
    );

    return () => clearTimeout(timer);
  }, [typedWord, isDeleting, wordIndex]);

  return (
    <section className="relative pt-24 sm:pt-28 lg:pt-32">
      <div className="subtle-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div className="section-shell pb-0">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(390px,500px)] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
          >
            <span className="inline-flex items-center rounded-full border border-ocean/25 bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ocean shadow-sm sm:px-4 sm:py-2 sm:text-xs">
              Certificação Digital ICP-Brasil
            </span>
            <h1 className="mt-6 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-6xl">
              <span className="block">Gere mais</span>
              <span className="block">
                <span className="text-ocean" aria-live="polite">
                  {typedWord}
                  <span className="animate-pulse text-ocean">|</span>
                </span>
                <span className="text-ink"> com</span>
              </span>
              <span className="block">Certificado Digital ICP-Brasil</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-muted sm:mt-6 sm:text-base sm:leading-8 lg:mx-0 lg:text-lg">
              Escolha entre e-CPF, e-CNPJ, NF-e e certificado em nuvem. Compare o modelo ideal, selecione a validade e
              finalize com o método de validação em um fluxo simples.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="mt-7 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row lg:justify-start"
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
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: "easeOut" }}
            className="mx-auto w-full max-w-[520px] lg:mx-0"
          >
            <HeroAssinatura />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-3 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4"
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


