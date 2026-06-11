import Navbar from "@/components/Navbar";
import StatsBar from "@/components/dashboard/StatsBar";
import Watchlist from "@/components/dashboard/Watchlist";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import { LayoutDashboard, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Dashboard — Akira AI",
  description: "Acompanhe o mercado financeiro em tempo real com a Akira AI.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <LayoutDashboard className="w-4.5 h-4.5 text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">Dashboard de Mercado</h1>
              <p className="text-xs text-muted">Dados simulados • Atualizado agora</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border/60 hover:border-accent/30 text-text-secondary hover:text-accent text-xs font-medium rounded-lg transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
            Atualizar
          </button>
        </div>

        {/* Stats bar */}
        <div className="mb-6">
          <StatsBar />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Watchlist — takes 2 columns */}
          <div className="xl:col-span-2">
            <Watchlist />
          </div>

          {/* Insights — takes 1 column */}
          <div className="xl:col-span-1">
            <InsightsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
