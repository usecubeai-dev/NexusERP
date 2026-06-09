import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akira AI — Invista com inteligência",
  description:
    "Seu copiloto para investimentos. Análises de mercado inteligentes com inteligência artificial.",
  keywords: ["investimentos", "IA", "análise financeira", "bolsa de valores", "inteligência artificial"],
  authors: [{ name: "Akira AI" }],
  openGraph: {
    title: "Akira AI — Invista com inteligência",
    description: "Seu copiloto para investimentos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-text-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
