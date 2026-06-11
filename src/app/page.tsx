import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Bot,
  TrendingUp,
  Zap,
  BarChart3,
  Target,
  Shield,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "IA especializada em investimentos",
    description:
      "Modelos de linguagem treinados com dados financeiros para respostas precisas e contextualizadas.",
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: TrendingUp,
    title: "Análises de mercado inteligentes",
    description:
      "Avaliações técnicas e fundamentalistas automatizadas para ações, FIIs e ativos de renda fixa.",
    color: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Zap,
    title: "Respostas rápidas e objetivas",
    description:
      "Processamento em tempo real para que você tome decisões no momento certo, sem atrasos.",
    color: "from-yellow-500/20 to-yellow-600/10",
    border: "border-yellow-500/20",
    iconColor: "text-yellow-400",
  },
  {
    icon: BarChart3,
    title: "Dados e indicadores em um só lugar",
    description:
      "P/L, P/VP, DY, ROE, CAGR e dezenas de indicadores consolidados em uma interface limpa.",
    color: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: Target,
    title: "Suporte para decisões mais informadas",
    description:
      "Cenários hipotéticos, simulações de carteira e análise de risco baseada em IA.",
    color: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: Shield,
    title: "Experiência moderna e segura",
    description:
      "Plataforma construída com as melhores práticas de segurança. Seus dados sempre protegidos.",
    color: "from-rose-500/20 to-rose-600/10",
    border: "border-rose-500/20",
    iconColor: "text-rose-400",
  },
];

const stats = [
  { value: "10k+", label: "Investidores ativos" },
  { value: "98%", label: "Satisfação dos usuários" },
  { value: "1M+", label: "Análises geradas" },
  { value: "24/7", label: "Disponibilidade" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-60 right-1/4 w-48 h-48 bg-blue-600/8 rounded-full blur-2xl pointer-events-none" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Advanced AI
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-text-primary leading-tight tracking-tight mb-6">
            Invista com{" "}
            <span className="gradient-text">inteligência.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-text-secondary font-medium mb-4">
            Seu copiloto para investimentos.
          </p>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            A Akira AI usa inteligência artificial de ponta para analisar mercados,
            identificar oportunidades e ajudar você a construir uma carteira mais
            inteligente e rentável.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/chat"
              className="group flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-2xl shadow-accent/30 hover:shadow-accent/50 transition-all text-base"
            >
              Começar agora
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-text-primary font-semibold rounded-xl border border-border hover:border-accent/30 transition-all text-base"
            >
              Ver dashboard
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm font-medium mb-4">
              <Star className="w-3.5 h-3.5" />
              Funcionalidades
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Tudo que você precisa para investir melhor
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-base">
              Uma plataforma completa que combina análise fundamentalista,
              inteligência artificial e dados em tempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`card-hover p-6 rounded-2xl bg-gradient-to-br ${feature.color} border ${feature.border} backdrop-blur-sm`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-card flex items-center justify-center mb-4 border ${feature.border}`}
                  >
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-text-primary font-semibold text-base mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pitch Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent-cyan/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-border/60 bg-card p-10 sm:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-accent-cyan/5 rounded-full blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-6">
                  <Sparkles className="w-3 h-3" />
                  Nossa missão
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-6">
                  A Akira AI combina inteligência artificial e análise financeira
                </h2>
                <p className="text-text-secondary text-base leading-relaxed mb-8">
                  para ajudar investidores a tomar decisões mais inteligentes.
                  Nossa plataforma processa milhares de dados de mercado em
                  tempo real, fornecendo insights acionáveis que antes estavam
                  disponíveis apenas para grandes gestores de fundos.
                </p>
                <ul className="space-y-3">
                  {[
                    "Análise fundamentalista automatizada",
                    "Monitoramento de carteira em tempo real",
                    "Alertas personalizados de oportunidades",
                    "Relatórios detalhados gerados por IA",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-text-secondary text-sm">
                      <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual element */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Mock chat preview */}
                  <div className="rounded-2xl border border-border bg-background/80 p-5 shadow-2xl">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                      <div className="w-2 h-2 rounded-full bg-positive" />
                      <span className="text-xs text-text-secondary font-medium">Akira AI • Online</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-card-alt rounded-xl rounded-tl-sm p-3 text-sm text-text-secondary max-w-[85%]">
                        Olá! Como posso ajudar seus investimentos hoje?
                      </div>
                      <div className="bg-accent/20 rounded-xl rounded-tr-sm p-3 text-sm text-accent ml-auto max-w-[85%] text-right">
                        Qual a análise de PETR4?
                      </div>
                      <div className="bg-card-alt rounded-xl rounded-tl-sm p-3 text-sm text-text-secondary max-w-[90%]">
                        <span className="text-text-primary font-medium">PETR4 — Análise Fundamentalista</span>
                        <br />
                        P/L: 5.2 • DY: 14.3% • ROE: 21.8%
                        <br />
                        <span className="text-positive text-xs">▲ Recomendação: Compra moderada</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <div className="flex-1 bg-background rounded-lg p-2.5 text-xs text-muted border border-border/50">
                        Pergunte algo...
                      </div>
                      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Pronto para investir com mais inteligência?
          </h2>
          <p className="text-text-secondary mb-8 text-base">
            Junte-se a milhares de investidores que já usam a Akira AI para tomar
            decisões mais informadas no mercado financeiro.
          </p>
          <Link
            href="/chat"
            className="group inline-flex items-center gap-2 px-10 py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-2xl shadow-accent/30 hover:shadow-accent/50 transition-all text-base"
          >
            Começar agora — é grátis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-accent to-accent-cyan rounded-md flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold gradient-text">Akira AI</span>
            </div>
            <p className="text-xs text-muted">
              © 2024 Akira AI. Não constitui recomendação de investimento.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted">
              <Link href="/chat" className="hover:text-text-secondary transition-colors">Chat</Link>
              <Link href="/dashboard" className="hover:text-text-secondary transition-colors">Dashboard</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
