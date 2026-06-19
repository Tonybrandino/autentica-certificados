import { Contato } from "@/components/Contato";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Building2,
  CheckCircle2,
  Eye,
  FileWarning,
  Gauge,
  Handshake,
  MailCheck,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import Link from "next/link";

const pillars = [
  {
    icon: Gauge,
    title: "Score e reputacao",
    description:
      "Acompanhe a saude financeira do CNPJ e entenda melhor como o mercado enxerga a confiabilidade da sua empresa."
  },
  {
    icon: Bell,
    title: "Alertas de mudanca",
    description:
      "Receba avisos quando houver alteracoes relevantes no documento monitorado, como consultas, apontamentos e dados cadastrais."
  },
  {
    icon: ShieldCheck,
    title: "Prevencao contra fraudes",
    description:
      "Identifique movimentacoes suspeitas com mais rapidez e ganhe tempo para agir antes que um risco vire prejuizo."
  }
];

const monitoredData = [
  "Pre-negativacoes",
  "Protestos",
  "Cheques sem fundos",
  "Acoes judiciais",
  "Pendencias financeiras e bancarias",
  "Falencias e recuperacoes judiciais",
  "Consultas realizadas na Serasa",
  "Informacoes cadastrais e societarias"
];

const steps = [
  {
    title: "Monitoramento continuo",
    description:
      "O produto acompanha informacoes ligadas ao seu CNPJ e aos documentos configurados para monitoramento."
  },
  {
    title: "Avisos por canais digitais",
    description:
      "Quando uma alteracao relevante acontece, sua empresa recebe alertas para analisar o caso com rapidez."
  },
  {
    title: "Visao para tomada de decisao",
    description:
      "Com os sinais de risco e reputacao em maos, voce decide melhor quando negociar, revisar processos ou buscar suporte."
  }
];

const audiences = [
  {
    icon: Building2,
    title: "Empresas que querem proteger o proprio CNPJ",
    description:
      "Ideal para acompanhar a reputacao financeira da empresa e reagir a movimentacoes que possam afetar credito, negociacoes e imagem."
  },
  {
    icon: UsersRound,
    title: "Socios e gestores",
    description:
      "Ajuda quem administra o negocio a enxergar apontamentos envolvendo socios, participacoes e documentos ligados a operacao."
  },
  {
    icon: Handshake,
    title: "Negocios com clientes e fornecedores recorrentes",
    description:
      "Pode apoiar uma rotina comercial mais segura ao monitorar terceiros importantes para contratos, vendas e parcerias."
  }
];

const faqs = [
  {
    question: "O que e o Saude do Seu Negocio?",
    answer:
      "E uma solucao de monitoramento continuo para acompanhar alteracoes no CNPJ, CPF, socios, participacoes e, conforme o plano contratado, clientes e fornecedores."
  },
  {
    question: "Como a empresa recebe os alertas?",
    answer:
      "A comunicacao pode acontecer por canais digitais, como e-mail e SMS, sempre que houver uma alteracao relevante nos documentos monitorados."
  },
  {
    question: "Ele substitui uma consulta de credito?",
    answer:
      "Nao. A proposta principal e monitorar mudancas e avisar sobre eventos importantes. Consultas e relatorios podem complementar a analise comercial."
  }
];

export const metadata = {
  title: "Saude do Seu Negocio | OKAY Certificados",
  description:
    "Conheca o Saude do Seu Negocio: monitoramento de CNPJ, alertas de risco, reputacao financeira e apoio contra fraudes."
};

export default function SaudeDoSeuNegocioPage() {
  return (
    <main className="overflow-hidden bg-white">
      <Header />

      <section className="relative isolate overflow-hidden bg-[#254f0f] pb-20 pt-32 text-white sm:pb-24 sm:pt-36">
        <div
          className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_18%_20%,rgba(126,208,56,0.35),transparent_28rem),linear-gradient(135deg,rgba(63,127,18,0.92),rgba(37,79,15,0.98)_55%,rgba(12,32,6,1))]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-20 opacity-45 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className="section-shell">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-lime-50 backdrop-blur">
                <Activity size={15} aria-hidden="true" />
                Saude do Seu Negocio
              </p>
              <h1 className="mt-5 max-w-3xl text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-[1.02] tracking-tight">
                Monitore seu CNPJ e proteja a reputacao da sua empresa
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-lime-50/90 sm:text-lg">
                Uma solucao institucional para acompanhar alteracoes no seu documento, receber alertas de risco,
                observar a reputacao financeira do negocio e agir com mais seguranca diante de fraudes, apontamentos
                e mudancas relevantes.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#como-funciona"
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-ocean shadow-[0_18px_45px_rgba(8,28,6,0.24)] smooth-ease hover:-translate-y-1 hover:bg-lime-50"
                >
                  Entender como funciona
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
                <Link
                  href="/#fale-conosco"
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-extrabold text-white backdrop-blur smooth-ease hover:-translate-y-1 hover:bg-white/16"
                >
                  Falar com a OKAY
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="rounded-[1.4rem] border border-white/20 bg-white p-5 text-ink shadow-[0_30px_90px_rgba(7,24,4,0.34)] sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Painel do CNPJ</p>
                    <h2 className="mt-1 text-xl font-black tracking-tight text-ink">Monitoramento ativo</h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-50 px-3 py-1.5 text-xs font-extrabold text-ocean">
                    <span className="h-2 w-2 rounded-full bg-trust" />
                    Online
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  {[
                    { icon: MailCheck, label: "Alerta recebido", value: "Alteracao cadastral identificada" },
                    { icon: Eye, label: "Consulta ao documento", value: "Nova consulta registrada" },
                    { icon: FileWarning, label: "Sinal de atencao", value: "Apontamento em acompanhamento" }
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-50 text-ocean">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                          {label}
                        </span>
                        <span className="mt-1 block text-sm font-bold text-slate-700">{value}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f8fcf3_0%,#ffffff_100%)] py-16 sm:py-20">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-ocean">O que faz</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
              Mais visibilidade sobre a saude financeira do negocio
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              O produto ajuda sua empresa a acompanhar sinais que podem impactar reputacao, credito e seguranca,
              reunindo alertas e monitoramento em uma rotina preventiva.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-lime-100 bg-white p-6 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-50 text-ocean">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-black text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-white py-16 sm:py-20">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-ocean">Como funciona</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
                Do alerta a acao, sem perder tempo
              </h2>
              <p className="mt-4 text-base leading-7 text-muted">
                A ideia e simples: acompanhar os documentos importantes, avisar quando algo mudar e dar contexto
                para voce agir antes que a situacao cresca.
              </p>
            </div>

            <div className="grid gap-4">
              {steps.map((step, index) => (
                <article key={step.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ocean text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-black text-ink">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50/70 py-16 sm:py-20">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-ocean">Para quem serve</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
                Para empresas que precisam decidir com mais seguranca
              </h2>
              <div className="mt-8 grid gap-4">
                {audiences.map(({ icon: Icon, title, description }) => (
                  <article key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-50 text-ocean">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-base font-black text-ink">{title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-muted">{description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-lime-100 bg-white p-6 shadow-lift">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-50 text-ocean">
                  <AlertTriangle size={22} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Dados monitorados</p>
                  <h3 className="text-xl font-black text-ink">Sinais que merecem atencao</h3>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                {monitoredData.map((item) => (
                  <p key={item} className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-700">
                    <CheckCircle2 size={17} className="mt-1 shrink-0 text-trust" aria-hidden="true" />
                    {item}
                  </p>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-ocean">Duvidas comuns</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
              O essencial para avaliar o produto
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4">
            {faqs.map(({ question, answer }) => (
              <article key={question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-black text-ink">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#254f0f] py-16 text-white">
        <div className="section-shell">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-lime-100">Atendimento OKAY</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                Quer entender se faz sentido para a sua empresa?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-lime-50/85">
                Nossa equipe pode orientar sua escolha e explicar como o monitoramento se encaixa na rotina do seu negocio.
              </p>
            </div>
            <Link
              href="/#fale-conosco"
              className="focus-ring inline-flex w-fit items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-ocean shadow-[0_18px_45px_rgba(8,28,6,0.24)] smooth-ease hover:-translate-y-1 hover:bg-lime-50"
            >
              Falar com especialista
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <Contato />
      <Footer />
    </main>
  );
}
