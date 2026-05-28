"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";

export function Contato() {
  return (
    <section id="fale-conosco" className="py-20 sm:py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Fale Conosco</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Estamos prontos para te ajudar
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Escolha o canal que preferir para tirar dúvidas, solicitar suporte ou iniciar sua compra.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {/* Telefone — placeholder para número real */}
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-ocean">
              <Phone size={22} aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-base font-black text-ink">Telefone</h3>
            {/* TODO: substituir pelo telefone real antes de publicar */}
            <p className="mt-2 text-sm font-bold text-slate-500">[INSERIR TELEFONE]</p>
            <p className="mt-1 text-xs text-muted">Seg a Sex · 8h às 18h</p>
          </div>

          {/* WhatsApp */}
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm smooth-ease hover:border-emerald-200 hover:shadow-soft"
            aria-label="Falar pelo WhatsApp"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              {/* TODO: substituir wa.me/5500000000000 pelo número real */}
              <MessageCircle size={22} aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-base font-black text-ink">WhatsApp</h3>
            <p className="mt-2 text-sm font-bold text-slate-500">Atendimento rápido</p>
            <p className="mt-1 text-xs text-muted">Clique para iniciar conversa</p>
          </a>

          {/* E-mail */}
          <a
            href="mailto:atendimento@certificabrasil.com.br"
            className="focus-ring flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm smooth-ease hover:border-sky-200 hover:shadow-soft"
            aria-label="Enviar e-mail para atendimento"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-ocean">
              <Mail size={22} aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-base font-black text-ink">E-mail</h3>
            <p className="mt-2 break-all text-sm font-bold text-slate-500">atendimento@certificabrasil.com.br</p>
            <p className="mt-1 text-xs text-muted">Resposta em até 1 dia útil</p>
          </a>
        </div>

        {/*
          BOTMAKER WEBCHAT — integração futura
          Para ativar o webchat Botmaker, insira o script fornecido pela plataforma
          dentro da tag <Script> do Next.js (src/app/layout.tsx) ou diretamente abaixo
          como elemento <script dangerouslySetInnerHTML={{ __html: "..." }} />.

          Exemplo de slot preparado:
          <div id="botmaker-webchat-container" aria-label="Chat de atendimento"></div>

          Não remover este bloco — ele marca o ponto de integração.
        */}
        <div
          id="botmaker-webchat-container"
          aria-label="Chat de atendimento online"
          className="sr-only"
        />
      </div>
    </section>
  );
}
