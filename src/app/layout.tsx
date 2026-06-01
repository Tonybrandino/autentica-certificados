import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OKAY | Certificado Digital e Soluções para Empresas",
  description:
    "Emita, renove e instale seu Certificado Digital com a OKAY. Soluções modernas, suporte especializado, pagamento facilitado e serviços para a saúde do seu negócio."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

