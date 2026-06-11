"use client";

import { Header } from "@/components/Header";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type LoginMode = "login" | "forgot" | "code" | "new-password" | "done";

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const passwordScore = useMemo(() => {
    const checks = [
      newPassword.length >= 8,
      /[A-Z]/.test(newPassword),
      /[0-9]/.test(newPassword),
      /[^A-Za-z0-9]/.test(newPassword)
    ];
    return checks.filter(Boolean).length;
  }, [newPassword]);

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password) {
      setMessage("Informe email e senha para acessar.");
      return;
    }
    setMessage("Login validado. Conecte este formulário à API de autenticação para liberar a área do cliente.");
  }

  function submitForgot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) {
      setMessage("Informe o email cadastrado para receber o código.");
      return;
    }
    setMessage("");
    setMode("code");
  }

  function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.trim().length < 6) {
      setMessage("Digite o código de 6 dígitos enviado para o email.");
      return;
    }
    setMessage("");
    setMode("new-password");
  }

  function submitNewPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwordScore < 3) {
      setMessage("Crie uma senha mais forte antes de continuar.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("As senhas não conferem.");
      return;
    }
    setMessage("");
    setMode("done");
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="relative overflow-hidden pt-28">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(126,208,56,0.22),transparent_28rem),linear-gradient(180deg,#f8fbff_0%,#ffffff_45%,#f6fbf1_100%)]"
          aria-hidden="true"
        />
        <div className="section-shell grid min-h-[calc(100vh-7rem)] items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-xl">
            <Link
              href="/"
              className="focus-ring inline-flex items-center gap-2 rounded-full text-sm font-extrabold text-ocean smooth-ease hover:text-[#32680f]"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar para o site
            </Link>
            <p className="mt-10 text-sm font-black uppercase tracking-[0.18em] text-ocean">Área do cliente</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Acesse seus certificados com segurança.
            </h1>
            <p className="mt-5 text-base leading-7 text-muted">
              Entre com email e senha para acompanhar pedidos, baixar documentos e solicitar suporte para seu
              certificado digital.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Ambiente seguro", ShieldCheck],
                ["Acesso por senha", LockKeyhole],
                ["Recuperação guiada", KeyRound]
              ].map(([label, Icon]) => (
                <div key={label as string} className="rounded-2xl border border-lime-100 bg-white/80 p-4 shadow-sm">
                  <Icon className="text-ocean" size={20} aria-hidden="true" />
                  <p className="mt-3 text-sm font-extrabold text-ink">{label as string}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md rounded-[1.4rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(48,97,13,0.16)] sm:p-8">
            {mode === "login" && (
              <form onSubmit={submitLogin} className="space-y-5">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Login</p>
                  <h2 className="mt-2 text-2xl font-black text-ink">Entrar na conta</h2>
                </div>
                <EmailField email={email} setEmail={setEmail} />
                <PasswordField
                  label="Senha"
                  value={password}
                  setValue={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-2 font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-ocean"
                    />
                    Lembrar acesso
                  </label>
                  <button
                    type="button"
                    className="focus-ring rounded-full font-extrabold text-ocean hover:text-[#32680f]"
                    onClick={() => {
                      setMessage("");
                      setMode("forgot");
                    }}
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <StatusMessage message={message} />
                <button
                  type="submit"
                  className="focus-ring w-full rounded-full bg-ocean px-5 py-3 text-sm font-extrabold text-white shadow-soft smooth-ease hover:-translate-y-0.5 hover:bg-[#32680f]"
                >
                  Entrar
                </button>
              </form>
            )}

            {mode === "forgot" && (
              <form onSubmit={submitForgot} className="space-y-5">
                <FormHeader
                  title="Redefinir senha"
                  description="Informe o email cadastrado para receber um código de verificação."
                  onBack={() => setMode("login")}
                />
                <EmailField email={email} setEmail={setEmail} />
                <StatusMessage message={message} />
                <button type="submit" className="focus-ring w-full rounded-full bg-ocean px-5 py-3 text-sm font-extrabold text-white">
                  Enviar código
                </button>
              </form>
            )}

            {mode === "code" && (
              <form onSubmit={submitCode} className="space-y-5">
                <FormHeader
                  title="Verificar email"
                  description={`Digite o código de 6 dígitos enviado para ${email || "seu email"}.`}
                  onBack={() => setMode("forgot")}
                />
                <label className="block">
                  <span className="text-sm font-extrabold text-slate-700">Código</span>
                  <input
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    placeholder="000000"
                    className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-2xl font-black tracking-[0.35em] text-ink outline-none"
                  />
                </label>
                <StatusMessage message={message} />
                <button type="submit" className="focus-ring w-full rounded-full bg-ocean px-5 py-3 text-sm font-extrabold text-white">
                  Confirmar código
                </button>
              </form>
            )}

            {mode === "new-password" && (
              <form onSubmit={submitNewPassword} className="space-y-5">
                <FormHeader
                  title="Criar nova senha"
                  description="Use uma senha forte para proteger o acesso aos seus documentos."
                  onBack={() => setMode("code")}
                />
                <PasswordField
                  label="Nova senha"
                  value={newPassword}
                  setValue={setNewPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
                <PasswordStrength score={passwordScore} />
                <PasswordField
                  label="Confirmar nova senha"
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
                <StatusMessage message={message} />
                <button type="submit" className="focus-ring w-full rounded-full bg-ocean px-5 py-3 text-sm font-extrabold text-white">
                  Salvar nova senha
                </button>
              </form>
            )}

            {mode === "done" && (
              <div className="space-y-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime-50 text-ocean">
                  <CheckCircle2 size={28} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-ink">Senha redefinida</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Sua nova senha foi registrada neste fluxo de exemplo. Agora você já pode voltar para o login.
                  </p>
                </div>
                <button
                  type="button"
                  className="focus-ring w-full rounded-full bg-ocean px-5 py-3 text-sm font-extrabold text-white"
                  onClick={() => {
                    setMode("login");
                    setPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setCode("");
                  }}
                >
                  Ir para login
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function FormHeader({
  title,
  description,
  onBack
}: {
  title: string;
  description: string;
  onBack: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        className="focus-ring mb-5 inline-flex items-center gap-2 rounded-full text-sm font-extrabold text-ocean"
        onClick={onBack}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar
      </button>
      <h2 className="text-2xl font-black text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function EmailField({ email, setEmail }: { email: string; setEmail: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-extrabold text-slate-700">Email</span>
      <span className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cyanx">
        <Mail size={18} className="text-ocean" aria-hidden="true" />
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          placeholder="voce@empresa.com.br"
          className="w-full bg-transparent text-sm font-bold text-ink outline-none placeholder:text-slate-400"
        />
      </span>
    </label>
  );
}

function PasswordField({
  label,
  value,
  setValue,
  showPassword,
  setShowPassword
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-extrabold text-slate-700">{label}</span>
      <span className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cyanx">
        <LockKeyhole size={18} className="text-ocean" aria-hidden="true" />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Digite sua senha"
          className="w-full bg-transparent text-sm font-bold text-ink outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          className="focus-ring rounded-full text-slate-500 hover:text-ocean"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </span>
    </label>
  );
}

function PasswordStrength({ score }: { score: number }) {
  const label = ["Muito fraca", "Fraca", "Boa", "Forte", "Muito forte"][score] ?? "Muito fraca";

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((item) => (
          <span
            key={item}
            className={`h-2 rounded-full ${item < score ? "bg-ocean" : "bg-slate-200"}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="mt-2 text-xs font-bold text-slate-500">Força da senha: {label}</p>
    </div>
  );
}

function StatusMessage({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-2xl border border-lime-100 bg-lime-50 px-4 py-3 text-sm font-bold leading-6 text-slate-700">
      {message}
    </p>
  );
}
