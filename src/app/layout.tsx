import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Certifica Brasil | Certificado Digital ICP-Brasil",
  description:
    "Compre e renove certificados digitais e-CPF, e-CNPJ, NF-e, CT-e e certificados em nuvem com validação online ou presencial."
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

