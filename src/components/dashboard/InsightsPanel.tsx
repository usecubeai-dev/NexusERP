import { Zap, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import Link from "next/link";

const insights = [
  {
    icon: TrendingUp,
    iconColor: "text-positive",
    iconBg: "bg-positive/10 border-positive/20",
    tag: "Oportunidade",
    tagColor: "text-positive bg-positive/10",
    title: "VALE3 com potencial de recuperação",
    description:
      "Os dados de exportação de minério de ferro da China subiram 8.3% no mês. Com o preço atual, VALE3 negocia abaixo do valor intrínseco estimado.",
  },
  {
    icon: AlertTriangle,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/10 border-yellow-500/20",
    tag: "Atenção",
    tagColor: "text-yellow-400 bg-yellow-500/10",
    title: "Ibovespa próximo de resistência",
    description:
      "O índice está próximo da resistência dos 130k pontos. Histórico aponta para consolidação ou correção técnica. Cautela com novas posições no curto prazo.",
  },
  {
    icon: Lightbulb,
    iconColor: "text-accent-cyan",
    iconBg: "bg-accent-cyan/10 border-accent-cyan/20",
    tag: "Insight",
    tagColor: "text-accent-cyan bg-accent-cyan/10",
    title: "FIIs de tijolo em destaque",
    description:
      "Com a queda da inflação, FIIs de lajes corporativas e shoppings estão performando acima da média. BRCO11 e HGLG11 se destacam por fundamentos sólidos.",
  },
];

const sectors = [
  { name: "Energia", change: "+2.4%", positive: true },
  { name: "Financeiro", change: "+0.8%", positive: true },
  { name: "Commodities", change: "-1.2%", positive: false },
  { name: "Varejo", change: "-2.1%", positive: false },
  { name: "Tech BR", change: "+3.7%", positive: true },
  { name: "Saúde", change: "+1.1%", positive: true },
];

export default function InsightsPanel() {
  return (
    <div className="space-y-4">
      {/* AI Insights */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent to-accent-cyan flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">Insights da IA</h3>
          </div>
          <Link href="/chat" className="text-xs text-accent hover:underline">
            Ver no chat →
          </Link>
        </div>

        <div className="p-4 space-y-3">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div
                key={insight.title}
                className="card-hover p-4 rounded-xl bg-card-alt border border-border/40 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${insight.iconBg}`}
                  >
                    <Icon className={`w-4 h-4 ${insight.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${insight.tagColor}`}
                      >
                        {insight.tag}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-text-primary mb-1">
                      {insight.title}
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sectors */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40">
          <h3 className="text-sm font-semibold text-text-primary">Setores em destaque</h3>
        </div>
        <div className="p-4 grid grid-cols-2 gap-2">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className="card-hover flex items-center justify-between px-3 py-2.5 rounded-lg bg-card-alt border border-border/40 cursor-pointer"
            >
              <span className="text-xs font-medium text-text-secondary">{sector.name}</span>
              <span
                className={`text-xs font-bold ${
                  sector.positive ? "text-positive" : "text-negative"
                }`}
              >
                {sector.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio summary */}
      <div className="bg-card border border-border/60 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Portfólio simulado</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted">Patrimônio total</span>
            <span className="text-sm font-bold text-text-primary">R$ 52.480,00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted">Rentabilidade (mês)</span>
            <span className="text-sm font-bold text-positive">+3.24%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted">Rentabilidade (ano)</span>
            <span className="text-sm font-bold text-positive">+18.7%</span>
          </div>
          <div className="w-full bg-card-alt rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-accent to-accent-cyan h-2 rounded-full"
              style={{ width: "67%" }}
            />
          </div>
          <p className="text-xs text-muted text-center">67% da meta anual atingida</p>
        </div>
      </div>
    </div>
  );
}
