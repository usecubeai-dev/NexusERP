import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akira Finance — IA para Investidores",
  description:
    "Seu copiloto para investimentos. Análise de ações, FIIs, ETFs e simulações com inteligência artificial.",
  keywords: ["investimentos", "IA", "análise financeira", "bolsa de valores", "inteligência artificial"],
  authors: [{ name: "Akira Finance" }],
  openGraph: {
    title: "Akira Finance — IA para Investidores",
    description: "Analise. Simule. Invista melhor.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, background: "#000", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </body>
    </html>
  );
}
