"use client";

import { TrendingUp, TrendingDown, Star, ChevronUp, ChevronDown } from "lucide-react";

const WATCHLIST = [
  {
    ticker: "PETR4",
    name: "Petrobras PN",
    price: "R$ 38,92",
    change: "+2.14%",
    changeAbs: "+0,82",
    volume: "R$ 892M",
    high: "R$ 39,20",
    low: "R$ 37,88",
    positive: true,
    sector: "Energia",
    dy: "14.3%",
    starred: true,
  },
  {
    ticker: "VALE3",
    name: "Vale ON",
    price: "R$ 61,40",
    change: "-0.97%",
    changeAbs: "-0,60",
    volume: "R$ 1.1B",
    high: "R$ 62,15",
    low: "R$ 61,02",
    positive: false,
    sector: "Mineração",
    dy: "10.2%",
    starred: true,
  },
  {
    ticker: "ITUB4",
    name: "Itaú Unibanco PN",
    price: "R$ 35,76",
    change: "+1.08%",
    changeAbs: "+0,38",
    volume: "R$ 534M",
    high: "R$ 35,90",
    low: "R$ 35,20",
    positive: true,
    sector: "Financeiro",
    dy: "5.2%",
    starred: false,
  },
  {
    ticker: "BBDC4",
    name: "Bradesco PN",
    price: "R$ 14,23",
    change: "-0.42%",
    changeAbs: "-0,06",
    volume: "R$ 312M",
    high: "R$ 14,45",
    low: "R$ 14,10",
    positive: false,
    sector: "Financeiro",
    dy: "4.8%",
    starred: false,
  },
  {
    ticker: "WEGE3",
    name: "WEG ON",
    price: "R$ 52,18",
    change: "+1.75%",
    changeAbs: "+0,90",
    volume: "R$ 189M",
    high: "R$ 52,40",
    low: "R$ 51,20",
    positive: true,
    sector: "Industrial",
    dy: "1.9%",
    starred: false,
  },
  {
    ticker: "MGLU3",
    name: "Magazine Luiza ON",
    price: "R$ 9,87",
    change: "+4.22%",
    changeAbs: "+0,40",
    volume: "R$ 278M",
    high: "R$ 10,02",
    low: "R$ 9,42",
    positive: true,
    sector: "Varejo",
    dy: "0.0%",
    starred: false,
  },
  {
    ticker: "RDOR3",
    name: "Rede D'Or ON",
    price: "R$ 28,54",
    change: "-1.38%",
    changeAbs: "-0,40",
    volume: "R$ 102M",
    high: "R$ 29,10",
    low: "R$ 28,30",
    positive: false,
    sector: "Saúde",
    dy: "0.4%",
    starred: false,
  },
  {
    ticker: "BBAS3",
    name: "Banco do Brasil ON",
    price: "R$ 27,89",
    change: "+0.65%",
    changeAbs: "+0,18",
    volume: "R$ 421M",
    high: "R$ 28,10",
    low: "R$ 27,60",
    positive: true,
    sector: "Financeiro",
    dy: "9.8%",
    starred: false,
  },
  {
    ticker: "HGLG11",
    name: "CSHG Logística FII",
    price: "R$ 162,40",
    change: "+0.31%",
    changeAbs: "+0,50",
    volume: "R$ 23M",
    high: "R$ 163,00",
    low: "R$ 161,80",
    positive: true,
    sector: "FII",
    dy: "9.2%",
    starred: false,
  },
  {
    ticker: "XPML11",
    name: "XP Malls FII",
    price: "R$ 103,20",
    change: "-0.58%",
    changeAbs: "-0,60",
    volume: "R$ 18M",
    high: "R$ 104,00",
    low: "R$ 102,90",
    positive: false,
    sector: "FII",
    dy: "9.8%",
    starred: false,
  },
];

const SECTOR_COLORS: { [key: string]: string } = {
  "Energia": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  "Mineração": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Financeiro": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Industrial": "text-purple-400 bg-purple-400/10 border-purple-400/20",
  "Varejo": "text-pink-400 bg-pink-400/10 border-pink-400/20",
  "Saúde": "text-green-400 bg-green-400/10 border-green-400/20",
  "FII": "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
};

export default function Watchlist() {
  return (
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div>
          <h2 className="text-text-primary font-semibold text-sm">Watchlist</h2>
          <p className="text-muted text-xs mt-0.5">{WATCHLIST.length} ativos monitorados</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <div className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse-slow" />
          Mercado aberto
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left text-xs text-muted font-medium px-5 py-3">Ativo</th>
              <th className="text-right text-xs text-muted font-medium px-3 py-3">Preço</th>
              <th className="text-right text-xs text-muted font-medium px-3 py-3">Variação</th>
              <th className="text-right text-xs text-muted font-medium px-3 py-3 hidden sm:table-cell">Máx / Mín</th>
              <th className="text-right text-xs text-muted font-medium px-3 py-3 hidden md:table-cell">Volume</th>
              <th className="text-right text-xs text-muted font-medium px-3 py-3 hidden lg:table-cell">DY</th>
              <th className="text-left text-xs text-muted font-medium px-3 py-3 hidden xl:table-cell">Setor</th>
            </tr>
          </thead>
          <tbody>
            {WATCHLIST.map((stock, idx) => (
              <tr
                key={stock.ticker}
                className={`border-b border-border/20 hover:bg-white/[0.02] transition-colors group cursor-pointer ${
                  idx === WATCHLIST.length - 1 ? "border-b-0" : ""
                }`}
              >
                {/* Ticker */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Star
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        stock.starred
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-border group-hover:text-muted"
                      } transition-colors`}
                    />
                    <div>
                      <div className="text-text-primary font-bold text-sm">{stock.ticker}</div>
                      <div className="text-muted text-xs truncate max-w-[140px]">{stock.name}</div>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="text-right px-3 py-3">
                  <span className="text-text-primary font-semibold text-sm">{stock.price}</span>
                </td>

                {/* Change */}
                <td className="text-right px-3 py-3">
                  <div
                    className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-semibold ${
                      stock.positive
                        ? "bg-positive/10 text-positive"
                        : "bg-negative/10 text-negative"
                    }`}
                  >
                    {stock.positive ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    {stock.change}
                  </div>
                </td>

                {/* High/Low */}
                <td className="text-right px-3 py-3 hidden sm:table-cell">
                  <div className="text-xs text-positive">{stock.high}</div>
                  <div className="text-xs text-negative">{stock.low}</div>
                </td>

                {/* Volume */}
                <td className="text-right px-3 py-3 hidden md:table-cell">
                  <span className="text-muted text-xs">{stock.volume}</span>
                </td>

                {/* DY */}
                <td className="text-right px-3 py-3 hidden lg:table-cell">
                  <span className="text-xs font-semibold text-accent-cyan">{stock.dy}</span>
                </td>

                {/* Sector */}
                <td className="px-3 py-3 hidden xl:table-cell">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      SECTOR_COLORS[stock.sector] || "text-muted bg-muted/10 border-muted/20"
                    }`}
                  >
                    {stock.sector}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
