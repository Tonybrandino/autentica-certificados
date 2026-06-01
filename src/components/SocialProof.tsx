"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useRef } from "react";

const metrics = [
  "+50 mil certificados emitidos",
  "Atendimento em todo o Brasil",
  "Suporte especializado",
  "Processo seguro"
];

const testimonials = [
  {
    name: "Marina Alves",
    role: "Empresária",
    comment: "Consegui comprar o e-CNPJ e agendar a validação sem precisar ligar para entender cada etapa."
  },
  {
    name: "Rafael Torres",
    role: "Contador",
    comment: "A comparação entre A1 e A3 ajuda muito no atendimento aos clientes que ainda estão em dúvida."
  },
  {
    name: "Joao Ribeiro",
    role: "MEI",
    comment: "Ficou claro qual certificado eu precisava para emitir nota e manter a empresa em dia."
  },
  {
    name: "Patricia Lemos",
    role: "Gestora Financeira",
    comment: "Escolhemos o certificado em nuvem e agora assinamos de qualquer lugar com muito mais agilidade."
  },
  {
    name: "Carlos Nogueira",
    role: "Advogado",
    comment: "Fluxo simples, rápido e sem burocracia. O suporte orientou todos os passos com clareza."
  },
  {
    name: "Luana Mendes",
    role: "Coordenadora Fiscal",
    comment: "A escolha de validade no card e o popup de validação reduziram muito o tempo de decisão."
  },
  {
    name: "Bruno Siqueira",
    role: "Diretor Operacional",
    comment: "Para a empresa, o e-CNPJ A3 trouxe mais controle interno sem complicar a rotina do time."
  },
  {
    name: "Camila Prado",
    role: "Analista Contábil",
    comment: "Gostei da navegação: em poucos cliques definimos modelo, validade e método de validação."
  },
  {
    name: "Renato Barros",
    role: "Transportador",
    comment: "Mesmo sem experiência, consegui fechar a compra com segurança e sem me perder na página."
  },
  {
    name: "Aline Souza",
    role: "Empreendedora",
    comment: "Renovei meu certificado com orientação clara e o processo foi bem mais rápido que eu esperava."
  }
];

export function SocialProof() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    let frameId = 0;
    const speed = 0.6;

    const animate = () => {
      const half = track.scrollWidth / 2;
      offsetRef.current -= speed;
      if (Math.abs(offsetRef.current) >= half) {
        offsetRef.current = 0;
      }
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const loopedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-20 sm:py-24">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Confiança</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Estrutura preparada para atender do MEI ao time contábil
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Prova social em movimento horizontal contínuo para reforçar confiança sem poluir a navegação.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {metrics.map((metric) => (
              <motion.div
                key={metric}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-lg font-black text-ink">{metric}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative mt-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
          <div ref={viewportRef} className="overflow-hidden" aria-label="Depoimentos em movimento horizontal">
            <div ref={trackRef} className="flex w-max gap-4 pb-2 will-change-transform">
              {loopedTestimonials.map(({ name, role, comment }, index) => (
                <motion.article
                  key={`${name}-${index}`}
                  whileHover={{ y: -2 }}
                  className="w-[280px] shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:w-[320px] sm:p-6"
                >
                  <div className="flex gap-1 text-yellow-400" aria-label="Avaliacao 5 de 5">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} size={17} fill="currentColor" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-700">&ldquo;{comment}&rdquo;</p>
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="font-black text-ink">{name}</p>
                    <p className="text-sm font-semibold text-muted">{role}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


