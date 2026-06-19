const footerColumns = [
  {
    heading: "Soluções",
    links: [
      { label: "Certificado Digital", href: "#certificados" },
      { label: "Saúde do Seu Negócio", href: "/saude-do-seu-negocio" },
      { label: "Suporte", href: "#suporte" },
      { label: "Instalar Certificado", href: "#suporte" }
    ]
  },
  {
    heading: "Atendimento",
    links: [
      { label: "Fale Conosco", href: "#fale-conosco" },
      { label: "WhatsApp", href: "https://wa.me/5518991712107" },
      { label: "Dúvidas", href: "#duvidas" },
      { label: "Suporte", href: "#suporte" }
    ]
  },
  {
    heading: "Legal",
    links: [
      { label: "Termos de uso", href: "#" },
      { label: "Política de privacidade", href: "#" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section-shell py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_0.8fr]">
          <div>
            <a href="#" className="focus-ring inline-flex items-center rounded-lg" aria-label="Ir para o início">
              <img src="/okay-logo.svg" alt="OKAY" className="h-10 w-auto sm:h-11" />
            </a>
            <p className="mt-5 max-w-xs text-sm leading-7 text-muted">
              Soluções digitais para emissão, renovação, suporte e gestão de certificados digitais,
              com atendimento especializado e foco em segurança.
            </p>
          </div>

          {footerColumns.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-ink">{heading}</h3>
              <nav className="mt-5 grid gap-3" aria-label={`Links de ${heading}`}>
                {links.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="focus-ring rounded-lg text-sm font-semibold text-muted smooth-ease hover:text-ocean"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted">© 2026 OKAY. Todos os direitos reservados.</p>
          <p className="text-xs text-muted">
            A emissão do certificado está sujeita à validação de identidade e às regras da
            Autoridade Certificadora responsável.
          </p>
        </div>
      </div>
    </footer>
  );
}
