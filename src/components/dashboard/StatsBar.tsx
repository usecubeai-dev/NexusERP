"use client";

import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const MARKET_STATS = [
  {
    label: "Ibovespa",
    value: "128.547",
    change: "+0.84%",
    changeValue: "+1.072",
    positive: true,
    flag: "🇧🇷",
  },
  {
    label: "S&P 500",
    value: "5.304",
    change: "+0.51%",
    changeValue: "+27",
    positive: true,
    flag: "🇺🇸",
  },
  {
    label: "Bitcoin",
    value: "R$ 343.820",
    change: "-1.23%",
    changeValue: "-4.290",
    positive: false,
    flag: "₿",
  },
  {
    label: "Dólar (BRL)",
    value: "R$ 5,14",
    change: "-0.38%",
    changeValue: "-0.02",
    positive: false,
    flag: "💵",
  },
  {
    label: "Euro (BRL)",
    value: "R$ 5,57",
    change: "+0.12%",
    changeValue: "+0.01",
    positive: true,
    flag: "€",
  },
  {
    label: "Selic",
    value: "10.50%",
    change: "a.a.",
    changeValue: "estável",
    positive: true,
    flag: "🏦",
  },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {MARKET_STATS.map((stat) => (
        <div
          key={stat.label}
          className="card-hover bg-card border border-border/60 rounded-xl p-3.5"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted font-medium">{stat.label}</span>
            <span className="text-sm">{stat.flag}</span>
          </div>
          <div className="text-text-primary font-bold text-sm">{stat.value}</div>
          <div className="flex items-center gap-1 mt-1">
            {stat.change !== "a.a." ? (
              <>
                {stat.positive ? (
                  <TrendingUp className="w-3 h-3 text-positive" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-negative" />
                )}
                <span
                  className={`text-xs font-medium ${
                    stat.positive ? "text-positive" : "text-negative"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted">({stat.changeValue})</span>
              </>
            ) : (
              <>
                <Activity className="w-3 h-3 text-muted" />
                <span className="text-xs text-muted">{stat.change}</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
