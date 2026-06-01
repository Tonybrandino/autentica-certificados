"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowRight, Bell, Shield, TrendingUp } from "lucide-react";

const healthCards = [
  {
    icon: TrendingUp,
    title: "Monitore seu CNPJ",
    description:
      "Acompanhe alterações importantes ligadas à sua empresa e receba alertas sempre que houver movimentações relevantes que possam impactar sua operação."
  },
  {
    icon: Shield,
    title: "Acompanhe sua reputação no mercado",
    description:
      "Entenda melhor como sua empresa é percebida e tenha mais clareza para cuidar da credibilidade do seu negócio."
  },
  {
    icon: Bell,
    title: "Receba alertas de risco",
    description:
      "Seja avisado sobre eventos que podem indicar risco financeiro, como pendências, protestos, consultas, alterações cadastrais e sinais de negativação."
  },
  {
    icon: AlertTriangle,
    title: "Proteja suas relações comerciais",
    description:
      "Monitore clientes, fornecedores e parceiros para negociar com mais segurança e reduzir riscos de inadimplência ou surpresas comerciais."
  }
];

function ekgPath(width: number, height: number, units: number) {
  const mid = height / 2;
  const seg = width / units;
  let d = `M0 ${mid}`;

  for (let i = 0; i < units; i += 1) {
    const x = i * seg;
    d += ` H${(x + seg * 0.4).toFixed(1)}`;
    d += ` L${(x + seg * 0.46).toFixed(1)} ${(mid - height * 0.06).toFixed(1)}`;
    d += ` L${(x + seg * 0.52).toFixed(1)} ${(mid + height * 0.1).toFixed(1)}`;
    d += ` L${(x + seg * 0.57).toFixed(1)} ${(mid - height * 0.4).toFixed(1)}`;
    d += ` L${(x + seg * 0.63).toFixed(1)} ${(mid + height * 0.3).toFixed(1)}`;
    d += ` L${(x + seg * 0.69).toFixed(1)} ${mid.toFixed(1)}`;
    d += ` H${(x + seg).toFixed(1)}`;
  }

  return d;
}

export function SaudeNegocio() {
  const [score, setScore] = useState(0);
  const bgPath = useMemo(() => ekgPath(2000, 180, 10), []);
  const smPath = useMemo(() => ekgPath(800, 56, 6), []);

  useEffect(() => {
    const target = 86;
    const duration = 1400;
    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setScore(Math.round(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    const timeout = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 450);

    const fallback = window.setTimeout(() => setScore(target), 2600);

    return () => {
      window.clearTimeout(timeout);
      window.clearTimeout(fallback);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="saude" className="saude-health relative isolate overflow-hidden bg-[#254f0f] py-20 text-white sm:py-24 lg:py-28">
      <div
        className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_18%_18%,rgba(126,208,56,0.32),transparent_30rem),linear-gradient(135deg,rgba(63,127,18,0.88),rgba(42,89,14,0.96)_52%,rgba(20,45,9,1))]"
        aria-hidden="true"
      />
      <div className="saude-grid absolute inset-0 -z-20" aria-hidden="true" />
      <div className="blob-cyan absolute -right-10 -top-16 -z-20 h-80 w-80 rounded-full bg-[#34d3c0]/20 blur-[64px]" aria-hidden="true" />
      <div className="blob-white absolute -bottom-20 -left-16 -z-20 h-96 w-96 rounded-full bg-white/10 blur-[64px]" aria-hidden="true" />
      <div className="blob-lime absolute left-[44%] top-[38%] -z-20 h-72 w-72 rounded-full bg-cyanx/15 blur-[64px]" aria-hidden="true" />

      <div className="saude-ekg absolute inset-x-0 top-[64%] -z-10 h-44 opacity-50" aria-hidden="true">
        <svg viewBox="0 0 2000 180" preserveAspectRatio="none" fill="none" className="h-full w-[200%]">
          <g className="ekg-track">
            <path d={bgPath} stroke="rgba(169,224,114,0.55)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>

      <div className="section-shell relative">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center xl:gap-14">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-lime-50">
                <span className="pulse-dot relative inline-flex text-lime-200">
                  <Activity size={16} strokeWidth={2.4} aria-hidden="true" />
                </span>
                Saúde do Seu Negócio
              </p>
              <span className="inline-flex items-center rounded-full border border-white/25 bg-white/12 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur">
                Produto adicional
              </span>
            </div>

            <h2 className="mt-5 max-w-3xl text-[clamp(1.85rem,4vw,3.05rem)] font-black leading-[1.08] tracking-tight text-white">
              Acompanhe a saúde da sua empresa <span className="text-lime-200">antes</span> que o risco vire problema
            </h2>

            <p className="mt-6 max-w-[42rem] text-base leading-7 text-lime-50/90 sm:text-lg">
              Com o <strong className="font-black text-white">Saúde do Seu Negócio</strong>, você monitora
              informações importantes da sua empresa, acompanha movimentações relevantes no seu CNPJ e recebe
              alertas para agir com mais segurança antes de tomar decisões comerciais.
            </p>

            <a
              href="#fale-conosco"
              className="focus-ring group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-ocean shadow-[0_18px_50px_rgba(20,45,9,0.24)] smooth-ease hover:-translate-y-1 hover:bg-lime-50 hover:shadow-[0_24px_60px_rgba(20,45,9,0.34)]"
            >
              Conhecer o produto
              <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden="true" />
            </a>

            <div className="mt-8 max-w-[440px] rounded-[18px] border border-white/15 bg-[#081c06]/40 p-5 shadow-[0_16px_40px_rgba(10,25,5,0.35)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.05em] text-lime-50/80">
                  <Activity size={14} aria-hidden="true" />
                  Índice de saúde · CNPJ
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-lime-200">
                  <span className="live-dot h-2 w-2 rounded-full bg-lime-200" />
                  Ao vivo
                </span>
              </div>

              <div className="mt-3 flex items-center gap-5">
                <div className="font-mono leading-none">
                  <b className="text-4xl font-black text-white">{score}</b>
                  <span className="text-sm font-bold text-lime-50/60">/100</span>
                  <em className="mt-1 block font-sans text-[11px] font-extrabold not-italic uppercase tracking-[0.04em] text-lime-200">
                    Estável ▲
                  </em>
                </div>
                <div className="monitor-wave h-14 flex-1 overflow-hidden rounded-lg">
                  <svg viewBox="0 0 800 56" preserveAspectRatio="none" fill="none" className="h-full w-[200%]">
                    <g className="ekg-track-fast">
                      <path d={smPath} stroke="#a9e072" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {healthCards.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="saude-card group relative overflow-hidden rounded-[18px] border border-white/20 bg-white p-5 text-ink shadow-[0_18px_50px_rgba(20,45,9,0.24)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_64px_rgba(20,45,9,0.30)]"
                style={{ animationDelay: `${index * 0.09}s` }}
              >
                <span className="absolute right-5 top-5 font-mono text-[11px] font-semibold tracking-[0.05em] text-ink/20">
                  0{index + 1}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-lime-50 text-ocean transition duration-300 group-hover:scale-105 group-hover:-rotate-3 group-hover:bg-[#e6f5d2]">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-black tracking-tight text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .saude-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(circle at 50% 40%, #000 0%, transparent 78%);
          -webkit-mask-image: radial-gradient(circle at 50% 40%, #000 0%, transparent 78%);
        }

        .blob-cyan {
          animation: float-a 14s ease-in-out infinite alternate;
        }

        .blob-white {
          animation: float-b 17s ease-in-out infinite alternate;
        }

        .blob-lime {
          animation: float-a 20s ease-in-out infinite alternate-reverse;
        }

        .saude-ekg {
          mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
        }

        .monitor-wave {
          mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
        }

        .ekg-track {
          animation: ekg-scroll 9s linear infinite;
        }

        .ekg-track-fast {
          animation: ekg-scroll 4.5s linear infinite;
        }

        .pulse-dot::after {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: 999px;
          border: 1.5px solid #a9e072;
          opacity: 0;
          animation: ping-ring 2.4s ease-out infinite;
        }

        .live-dot {
          box-shadow: 0 0 0 0 rgba(169, 224, 114, 0.7);
          animation: blink-live 1.8s ease-in-out infinite;
        }

        .saude-card {
          opacity: 0;
          transform: translateY(20px);
          animation: card-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .saude-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: -40%;
          width: 40%;
          height: 100%;
          background: linear-gradient(100deg, transparent, rgba(126, 208, 56, 0.14), transparent);
          transform: skewX(-18deg);
          transition: left 0.6s ease;
          pointer-events: none;
        }

        .saude-card:hover::after {
          left: 130%;
        }

        @keyframes float-a {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(-44px, 38px) scale(1.12);
          }
        }

        @keyframes float-b {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(54px, -30px) scale(1.08);
          }
        }

        @keyframes ekg-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes ping-ring {
          0% {
            transform: scale(0.6);
            opacity: 0.7;
          }
          80%,
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }

        @keyframes blink-live {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(169, 224, 114, 0.6);
            opacity: 1;
          }
          50% {
            box-shadow: 0 0 0 7px rgba(169, 224, 114, 0);
            opacity: 0.55;
          }
        }

        @keyframes card-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .blob-cyan,
          .blob-white,
          .blob-lime,
          .ekg-track,
          .ekg-track-fast,
          .pulse-dot::after,
          .live-dot,
          .saude-card {
            animation: none !important;
          }

          .saude-card {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
