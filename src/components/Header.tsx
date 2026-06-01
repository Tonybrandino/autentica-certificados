"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Sobre", href: "#sobre" },
  { label: "Certificado Digital", href: "#certificados" },
  { label: "Saúde do Seu Negócio", href: "#saude" },
  { label: "Suporte", href: "#suporte" },
  { label: "Dúvidas", href: "#duvidas" },
  { label: "Fale Conosco", href: "#fale-conosco" }
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-lime-100 bg-white/90 shadow-[0_10px_30px_rgba(63,127,18,0.12)] backdrop-blur-xl"
          : "border-transparent bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="section-shell flex h-20 items-center justify-between gap-5">
        <a href="#" className="focus-ring flex items-center rounded-lg" aria-label="Ir para o início">
          <img src="/okay-logo.png" alt="Autêntica Certificados" className="h-10 w-auto sm:h-11" />
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="focus-ring rounded-full px-2 py-1 text-sm font-bold text-slate-700 smooth-ease hover:text-ocean"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#"
            className="focus-ring rounded-full bg-ocean px-5 py-2.5 text-sm font-extrabold text-white shadow-soft smooth-ease hover:-translate-y-0.5 hover:bg-[#32680f]"
          >
            LOGIN
          </a>
        </div>

        <button
          type="button"
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-ink lg:hidden"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-slate-200 bg-white/98 px-4 py-4 shadow-soft backdrop-blur-xl lg:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-2" aria-label="Navegação mobile">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="focus-ring rounded-xl px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <a
                  href="#"
                  onClick={() => setIsOpen(false)}
                  className="focus-ring rounded-full bg-ocean px-4 py-3 text-center text-sm font-extrabold text-white"
                >
                  LOGIN
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

