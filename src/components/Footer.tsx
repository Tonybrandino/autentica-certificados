import { Mail, MessageCircle } from "lucide-react";

const footerLinks = ["Certificados", "Validação", "Renovação", "Suporte", "Política de Privacidade", "Termos de Uso"];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <a href="#" className="focus-ring inline-flex items-center rounded-lg" aria-label="Ir para o início">
              <img src="/acd.svg" alt="Autêntica Certificados" className="h-10 w-auto sm:h-11" />
            </a>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted">
              Home demonstrativa para venda de certificados digitais, pronta para evoluir com carrinho, checkout,
              área do cliente e integrações comerciais.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-ink">Links</h3>
            <nav className="mt-5 grid gap-3" aria-label="Links do rodapé">
              {footerLinks.map((link) => (
                <a key={link} href="#certificados" className="focus-ring rounded-lg text-sm font-semibold text-muted hover:text-ocean">
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-ink">Contato</h3>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-muted">
              <a href="https://wa.me/5500000000000" className="focus-ring flex items-center gap-2 rounded-lg hover:text-ocean">
                <MessageCircle size={17} aria-hidden="true" />
                WhatsApp
              </a>
              <a href="mailto:atendimento@certificabrasil.com.br" className="focus-ring flex items-center gap-2 rounded-lg hover:text-ocean break-all">
                <Mail size={17} aria-hidden="true" />
                atendimento@certificabrasil.com.br
              </a>
              <p>Atendimento: segunda a sexta, 8h às 18h</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-xs leading-6 text-muted">
            A emissão do certificado está sujeita à validação de identidade e às regras da Autoridade Certificadora
            responsável.
          </p>
        </div>
      </div>
    </footer>
  );
}
