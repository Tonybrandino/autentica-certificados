"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";

const channels = [
  {
    icon: Phone,
    label: "Telefone",
    value: "(18) 99171-2107",
    detail: "Seg a Sex · 8h às 18h",
    href: "tel:+5518991712107",
    color: "bg-sky-50 text-ocean"
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "(18) 99171-2107",
    detail: "Atendimento rápido",
    href: "https://wa.me/5518991712107",
    color: "bg-emerald-50 text-emerald-600",
    hoverBorder: "hover:border-emerald-200"
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "contato@okay.com.br", // Substituir pelos dados oficiais da OKAY
    detail: "Resposta em até 1 dia útil",
    href: "mailto:contato@okay.com.br", // Substituir pelos dados oficiais da OKAY
    color: "bg-sky-50 text-ocean"
  }
];

type FormState = "idle" | "sending" | "sent";

export function Contato() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [fields, setFields] = useState({ name: "", email: "", phone: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("sending");
    setTimeout(() => setFormState("sent"), 1400);
  }

  return (
    <section id="fale-conosco" className="bg-slate-50/60 py-20 sm:py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Fale Conosco</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Precisa de ajuda para escolher seu certificado?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
            Fale com a equipe OKAY e receba orientação para encontrar a melhor solução para sua
            necessidade.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          {/* Canais de atendimento */}
          <div className="space-y-4">
            {channels.map(({ icon: Icon, label, value, detail, href, color, hoverBorder }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`focus-ring flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm smooth-ease hover:shadow-soft ${hoverBorder ?? "hover:border-sky-200"}`}
                aria-label={`Entrar em contato via ${label}`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon size={22} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-black text-ink">{label}</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-600">{value}</p>
                  <p className="mt-0.5 text-xs text-muted">{detail}</p>
                </div>
              </a>
            ))}

            {/*
              BOTMAKER WEBCHAT — integração futura
              Para ativar o webchat Botmaker, insira o script fornecido pela plataforma
              dentro da tag <Script> do Next.js (src/app/layout.tsx).
              Slot preparado abaixo — não remover.
            */}
            <div
              id="botmaker-webchat-container"
              aria-label="Chat de atendimento online"
              className="sr-only"
            />
          </div>

          {/* Formulário de contato */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
            {formState === "sent" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-trust/10 text-trust">
                  <Send size={28} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-xl font-black text-ink">Mensagem enviada!</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Recebemos sua mensagem e entraremos em contato em breve.
                </p>
                <button
                  type="button"
                  onClick={() => { setFormState("idle"); setFields({ name: "", email: "", phone: "", message: "" }); }}
                  className="focus-ring mt-6 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 smooth-ease hover:border-ocean hover:text-ocean"
                >
                  Enviar outra mensagem
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 className="text-base font-black text-ink">Envie uma mensagem</h3>
                <p className="mt-1 text-sm text-muted">Responderemos em até 1 dia útil.</p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-bold text-slate-700">
                      Nome <span aria-hidden="true" className="text-ocean">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={fields.name}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="focus-ring mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink placeholder-slate-400 outline-none transition focus:border-ocean focus:bg-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-bold text-slate-700">
                      E-mail <span aria-hidden="true" className="text-ocean">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={fields.email}
                      onChange={handleChange}
                      placeholder="seu@email.com.br"
                      className="focus-ring mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink placeholder-slate-400 outline-none transition focus:border-ocean focus:bg-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-bold text-slate-700">
                      Telefone
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={fields.phone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      className="focus-ring mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink placeholder-slate-400 outline-none transition focus:border-ocean focus:bg-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-bold text-slate-700">
                      Mensagem <span aria-hidden="true" className="text-ocean">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={4}
                      value={fields.message}
                      onChange={handleChange}
                      placeholder="Como podemos ajudar?"
                      className="focus-ring mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink placeholder-slate-400 outline-none transition focus:border-ocean focus:bg-white"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={formState === "sending"}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ocean px-6 py-3.5 text-sm font-extrabold text-white shadow-soft smooth-ease hover:bg-[#006B9A] disabled:opacity-60"
                >
                  {formState === "sending" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      Enviar mensagem
                      <Send size={16} aria-hidden="true" />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
