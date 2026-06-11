import { NextRequest, NextResponse } from "next/server";

const pdfGuides = {
  "certificado-a1": {
    title: "Instalar certificado A1",
    filename: "guia-certificado-a1.pdf",
    lines: [
      "1. Baixe o arquivo do certificado no computador autorizado.",
      "2. Abra o assistente de importacao e informe a senha recebida.",
      "3. Marque a protecao da chave privada quando disponivel.",
      "4. Conclua a instalacao e teste o acesso no navegador."
    ]
  },
  "certificado-cartao": {
    title: "Instalar certificado em cartao",
    filename: "guia-certificado-cartao.pdf",
    lines: [
      "1. Conecte a leitora de cartao ao computador.",
      "2. Instale o driver da leitora e o gerenciador criptografico.",
      "3. Insira o cartao e confirme se ele foi reconhecido.",
      "4. Teste o certificado no portal de assinatura ou emissao."
    ]
  },
  "certificado-token": {
    title: "Instalar certificado em token",
    filename: "guia-certificado-token.pdf",
    lines: [
      "1. Conecte o token USB diretamente ao computador.",
      "2. Instale o driver indicado para o modelo do dispositivo.",
      "3. Abra o gerenciador do token e confira o status do certificado.",
      "4. Reinicie o navegador antes de realizar o primeiro teste."
    ]
  },
  "bird-id-nuvem": {
    title: "Instalar Bird ID / Nuvem",
    filename: "guia-bird-id-nuvem.pdf",
    lines: [
      "1. Acesse sua conta Bird ID com email e senha cadastrados.",
      "2. Ative o segundo fator de autenticacao no aplicativo.",
      "3. Autorize o uso do certificado na aplicacao desejada.",
      "4. Revise os acessos ativos periodicamente."
    ]
  },
  "renovacao-certificado": {
    title: "Renovacao de certificado",
    filename: "guia-renovacao-certificado.pdf",
    lines: [
      "1. Confira a data de validade do certificado atual.",
      "2. Solicite a renovacao antes do vencimento.",
      "3. Separe documento de identificacao e dados da empresa.",
      "4. Instale o novo certificado e remova versoes expiradas."
    ]
  },
  "problemas-acesso": {
    title: "Problemas de acesso",
    filename: "guia-problemas-acesso.pdf",
    lines: [
      "1. Verifique se o certificado aparece no gerenciador do sistema.",
      "2. Atualize drivers, navegador e componentes de seguranca.",
      "3. Confirme se a senha PIN esta correta e desbloqueada.",
      "4. Se o erro persistir, fale com o suporte informando o codigo exibido."
    ]
  }
} as const;

type GuideSlug = keyof typeof pdfGuides;

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function createPdf(title: string, lines: readonly string[]) {
  const contentLines = [
    "BT",
    "/F1 22 Tf",
    "72 760 Td",
    `(${escapePdfText(title)}) Tj`,
    "/F1 12 Tf",
    "0 -38 Td",
    "(Guia de exemplo para leitura e download.) Tj",
    "0 -32 Td",
    ...lines.flatMap((line) => [`(${escapePdfText(line)}) Tj`, "0 -24 Td"]),
    "0 -18 Td",
    "(Este material e demonstrativo e pode ser substituido pelo PDF oficial.) Tj",
    "ET"
  ];
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${contentLines.join("\n").length} >>\nstream\n${contentLines.join("\n")}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const guide = pdfGuides[slug as GuideSlug];

  if (!guide) {
    return NextResponse.json({ message: "PDF nao encontrado." }, { status: 404 });
  }

  const shouldDownload = request.nextUrl.searchParams.get("download") === "1";

  return new NextResponse(createPdf(guide.title, guide.lines), {
    headers: {
      "Content-Disposition": `${shouldDownload ? "attachment" : "inline"}; filename="${guide.filename}"`,
      "Content-Type": "application/pdf"
    }
  });
}
