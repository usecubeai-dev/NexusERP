import { useState, useRef, useEffect } from "react";
import { supabase, STRIPE_LINKS } from "./supabase.js";

// ═══════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════
const T = {
  bg:        "#000000",
  card:      "#111111",
  cardAlt:   "#1A1A1A",
  border:    "#27272A",
  green:     "#22C55E",
  greenHov:  "#16A34A",
  greenNeon: "#4ADE80",
  greenGlow: "rgba(34,197,94,0.25)",
  red:       "#EF4444",
  yellow:    "#EAB308",
  text:      "#FFFFFF",
  textSub:   "#A1A1AA",
  textMid:   "#71717A",
};

// ═══════════════════════════════════════════════
// GLOBAL CSS — completo, sem truncamentos
// ═══════════════════════════════════════════════
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body {
    background: #000;
    font-family: 'Space Grotesk', sans-serif;
    color: #fff;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }
  input, button, textarea { font-family: 'Space Grotesk', sans-serif; }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #27272A; border-radius: 2px; }
  input[type=range] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 100%;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #22C55E;
    cursor: pointer;
    border: 2px solid #000;
    box-shadow: 0 0 8px rgba(34,197,94,0.6);
  }
  input[type=range]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #22C55E;
    cursor: pointer;
    border: 2px solid #000;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes glow {
    0%,100% { box-shadow: 0 0 10px rgba(34,197,94,0.3); }
    50%     { box-shadow: 0 0 24px rgba(34,197,94,0.65); }
  }
  @keyframes blink {
    0%,100% { opacity:1; } 50% { opacity:0.15; }
  }
  @keyframes dot {
    0%,80%,100% { transform:translateY(0); opacity:0.3; }
    40%         { transform:translateY(-5px); opacity:1; }
  }
  @keyframes msgIn {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes owlFloat {
    0%,100% { transform:translateY(0); }
    50%     { transform:translateY(-2.5px); }
  }
  @keyframes owlPulse {
    0%,100% { filter:drop-shadow(0 0 5px rgba(34,197,94,0.6)); }
    50%     { filter:drop-shadow(0 0 18px rgba(74,222,128,1)); }
  }
  @keyframes scanline {
    from { top:-2px; } to { top:100%; }
  }
  @keyframes barIn {
    from { transform:scaleY(0); } to { transform:scaleY(1); }
  }
`;

// ═══════════════════════════════════════════════
// ICON
// ═══════════════════════════════════════════════
const Ic = ({ n, s = 20, c = "currentColor" }) => {
  const d = {
    home:    <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    chat:    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>,
    calc:    <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></>,
    news:    <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 11h10M7 15h4"/></>,
    plans:   <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    send:    <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    check:   <polyline points="20 6 9 17 4 12"/>,
    lock:    <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    trend:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    info:    <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    spark:   <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/>,
    wallet:  <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>,
    arrow:   <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    profile: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c}
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {d[n]}
    </svg>
  );
};

// ═══════════════════════════════════════════════
// OWL MASCOT
// Cole aqui o base64 original da imagem (data:image/jpeg;base64,...)
// ═══════════════════════════════════════════════
const OWL_IMG = "data:image/jpeg;base64,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";

const Owl = ({ size = 40, pulse = false }) => (
  <div style={{
    width: size, height: size, flexShrink: 0, borderRadius: "50%",
    overflow: "hidden", position: "relative",
    animation: pulse
      ? "owlPulse 2.8s ease-in-out infinite, owlFloat 3s ease-in-out infinite"
      : "none",
    boxShadow: pulse ? "0 0 0 2px rgba(34,197,94,0.3)" : "none",
    background: "#1A1A1A",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    {OWL_IMG ? (
      <img src={OWL_IMG} alt="Akira"
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block" }}
      />
    ) : (
      <span style={{ fontSize: size * 0.5, lineHeight: 1 }}>🦉</span>
    )}
  </div>
);

// ═══════════════════════════════════════════════
// NOTIFICATION BADGE
// ═══════════════════════════════════════════════
const NotifBadge = ({ count }) => count > 0 ? (
  <div style={{
    position: "absolute", top: -4, right: -4,
    width: 16, height: 16, borderRadius: "50%",
    background: "#EF4444", border: "2px solid #000",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 8, fontWeight: 800, color: "#fff",
  }}>{count > 9 ? "9+" : count}</div>
) : null;

// ═══════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════
const HomeScreen = ({ go }) => {
  const bars   = [42, 55, 48, 70, 63, 82, 100];
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul"];
  const assets = [
    { t:"PETR4",  n:"Petrobras",  v:"R$38,90",  c:"+3,2%", pos:true  },
    { t:"MXRF11", n:"Maxi Renda", v:"R$11,42",  c:"+1,7%", pos:true  },
    { t:"IVVB11", n:"S&P 500 BR", v:"R$312,00", c:"-0,4%", pos:false },
    { t:"SELIC",  n:"Tesouro",    v:"10,5%",    c:"+0,9%", pos:true  },
  ];

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 0" }}>
      {/* HEADER */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:16, animation:"fadeUp 0.3s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Owl size={40} pulse />
          <div>
            <div style={{ fontSize:11, color:T.textSub }}>Olá, Rafael 👋</div>
            <div style={{ fontSize:17, fontWeight:700, letterSpacing:-0.4 }}>Dashboard</div>
          </div>
        </div>
        <div style={{
          background:"rgba(34,197,94,0.08)", border:`1px solid rgba(34,197,94,0.25)`,
          borderRadius:20, padding:"5px 12px", display:"flex", alignItems:"center", gap:6,
          fontSize:10, color:T.green, fontWeight:700,
          animation:"glow 3s ease-in-out infinite",
        }}>
          <div style={{ width:5, height:5, borderRadius:"50%", background:T.green,
            animation:"blink 1.5s ease-in-out infinite" }} />
          PRO
        </div>
      </div>

      {/* PATRIMÔNIO HERO */}
      <div style={{
        background:T.card, border:`1px solid ${T.border}`,
        borderRadius:20, padding:"20px 18px", marginBottom:12,
        position:"relative", overflow:"hidden", animation:"fadeUp 0.4s ease",
      }}>
        <div style={{
          position:"absolute", left:0, right:0, height:"1px",
          background:"linear-gradient(to right, transparent, rgba(34,197,94,0.15), transparent)",
          animation:"scanline 5s linear infinite", pointerEvents:"none",
        }} />
        <div style={{ fontSize:10, color:T.textMid, marginBottom:6, textTransform:"uppercase",
          fontFamily:"'JetBrains Mono', monospace" }}>Patrimônio Total</div>
        <div style={{ fontSize:36, fontWeight:700, letterSpacing:-1.5, lineHeight:1, marginBottom:8 }}>
          R$ 48.320<span style={{ fontSize:20, fontWeight:400, color:T.textSub }}>,00</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
          <span style={{ fontSize:12, color:T.green, fontWeight:600,
            background:"rgba(34,197,94,0.08)", padding:"2px 8px", borderRadius:6 }}>
            ↑ +12,4% este mês
          </span>
          <span style={{ fontSize:11, color:T.textSub }}>+R$ 5.240</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {[
            { l:"Investido",  v:"R$ 38.500" },
            { l:"Rendimento", v:"R$ 9.820"  },
            { l:"Meta 2025",  v:"68%"        },
          ].map(m => (
            <div key={m.l} style={{ background:T.cardAlt, borderRadius:10, padding:"10px 10px" }}>
              <div style={{ fontSize:9.5, color:T.textSub, marginBottom:3 }}>{m.l}</div>
              <div style={{ fontSize:13, fontWeight:600, fontFamily:"'JetBrains Mono', monospace" }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12,
        animation:"fadeUp 0.5s ease" }}>
        {[
          { icon:"wallet", label:"Carteira",   sub:"4 ativos",      tab:"home"    },
          { icon:"calc",   label:"Simulador",  sub:"Projetar agora",tab:"calc"    },
          { icon:"news",   label:"Notícias",   sub:"8 novas hoje",  tab:"news"    },
          { icon:"chat",   label:"Chat Akira", sub:"IA ativa",      tab:"chat"    },
        ].map(c => (
          <button key={c.label} onClick={() => go(c.tab)} style={{
            background:T.card, border:`1px solid ${T.border}`,
            borderRadius:16, padding:"14px 14px", textAlign:"left", cursor:"pointer",
            transition:"border-color 0.15s, transform 0.12s",
          }}
            onMouseDown={e => e.currentTarget.style.transform="scale(0.96)"}
            onMouseUp={e   => e.currentTarget.style.transform="scale(1)"}
          >
            <div style={{ width:32, height:32, borderRadius:9,
              background:"rgba(34,197,94,0.08)", border:`1px solid rgba(34,197,94,0.15)`,
              display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
              <Ic n={c.icon} s={16} c={T.green} />
            </div>
            <div style={{ fontSize:12, fontWeight:600, marginBottom:2 }}>{c.label}</div>
            <div style={{ fontSize:10, color:T.textSub }}>{c.sub}</div>
          </button>
        ))}
      </div>

      {/* CHART */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18,
        padding:16, marginBottom:12, animation:"fadeUp 0.55s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600 }}>Evolução Patrimonial</div>
            <div style={{ fontSize:10, color:T.textSub }}>Últimos 7 meses</div>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:T.green,
            fontFamily:"'JetBrains Mono', monospace" }}>+25,4%</span>
        </div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:72 }}>
          {bars.map((h, i) => {
            const last = i === 6;
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{
                  width:"100%", borderRadius:"3px 3px 0 0",
                  height:`${h}%`,
                  background: last ? `linear-gradient(to top, ${T.greenHov}, ${T.green})` : T.cardAlt,
                  boxShadow: last ? `0 0 14px rgba(34,197,94,0.4)` : "none",
                  transformOrigin:"bottom", animation:"barIn 0.8s ease forwards",
                }} />
                <span style={{ fontSize:8, color: last ? T.green : T.textMid,
                  fontFamily:"'JetBrains Mono', monospace" }}>{months[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ASSETS */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18,
        padding:16, marginBottom:12, animation:"fadeUp 0.6s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:600 }}>Minha Carteira</div>
          <div style={{ fontSize:10, color:T.green, cursor:"pointer" }}
            onClick={() => go("home")}>Ver todos →</div>
        </div>
        {assets.map((a, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            paddingBottom: i < 3 ? 12 : 0, marginBottom: i < 3 ? 12 : 0,
            borderBottom: i < 3 ? `1px solid ${T.border}` : "none",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10,
                background:T.cardAlt, border:`1px solid ${T.border}`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:8, fontWeight:700, color:T.green,
                  fontFamily:"'JetBrains Mono', monospace" }}>{a.t.slice(0,2)}</span>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600 }}>{a.t}</div>
                <div style={{ fontSize:10, color:T.textSub }}>{a.n}</div>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:12, fontWeight:600,
                fontFamily:"'JetBrains Mono', monospace" }}>{a.v}</div>
              <div style={{ fontSize:10, fontWeight:600, color: a.pos ? T.green : T.red }}>{a.c}</div>
            </div>
          </div>
        ))}
      </div>

      {/* AKIRA CTA */}
      <button onClick={() => go("chat")} style={{
        width:"100%", background:T.card, border:`1px solid rgba(34,197,94,0.3)`,
        borderRadius:18, padding:"14px 16px",
        display:"flex", alignItems:"center", gap:12, cursor:"pointer",
        marginBottom:8, animation:"fadeUp 0.65s ease", transition:"border-color 0.2s",
      }}>
        <Owl size={44} pulse />
        <div style={{ flex:1, textAlign:"left" }}>
          <div style={{ fontSize:13, fontWeight:700 }}>Perguntar à Akira</div>
          <div style={{ fontSize:11, color:T.textSub }}>"Vale a pena investir em PETR4?"</div>
        </div>
        <div style={{ width:36, height:36, borderRadius:10, background:T.green,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 0 16px rgba(34,197,94,0.5)` }}>
          <Ic n="send" s={15} c="#000" />
        </div>
      </button>
      <div style={{ height:16 }} />
    </div>
  );
};

// ═══════════════════════════════════════════════
// CHAT SCREEN
// FIX: XSS via dangerouslySetInnerHTML corrigido com escapeHtml
// FIX: Duplo envio bloqueado com guard `loading`
// FIX: Memory leak corrigido com ref `mounted`
// FIX: buildAnalysis usa "petrobras" em vez de "petro" (muito abrangente)
// ═══════════════════════════════════════════════
const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#039;");

const INIT_MSGS = [{
  role: "ai",
  time: "09:41",
  text: "Olá! Sou a **Akira** 🦉, sua analista financeira com inteligência artificial.\n\nPosso analisar ações, FIIs, ETFs e simular seus investimentos. Como posso ajudar?",
}];

const QUICK = ["Analise PETR4","Top FIIs 2025","SELIC vs CDB","Resumo do mercado"];

const buildAnalysis = (txt) => {
  const q = txt.toLowerCase();
  // FIX: condição mais precisa — só dispara para petr4 ou petrobras
  if (!q.includes("petr4") && !q.includes("petrobras")) return null;
  return {
    ticker: "PETR4", company: "Petrobras PN", score: 72,
    rows: [
      { icon:"check", c:T.green,  l:"Pontos Positivos",  v:"Maior pagadora de dividendos do Brasil" },
      { icon:"info",  c:T.red,    l:"Pontos Negativos",  v:"Alta exposição a risco político e cambial" },
      { icon:"spark", c:T.green,  l:"Dividend Yield",    v:"12,8% a.a. — acima da média setorial" },
      { icon:"spark", c:T.green,  l:"P/L",               v:"5,2x — subavaliado frente ao setor" },
      { icon:"plans", c:T.yellow, l:"Perfil Recomendado",v:"Moderado a Arrojado · horizonte médio/longo" },
    ],
  };
};

const ChatScreen = () => {
  const [msgs,      setMsgs]      = useState(INIT_MSGS);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bot     = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    bot.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const send = async (txt) => {
    // FIX: bloqueia envio duplo enquanto carregando
    if (!txt.trim() || loading) return;
    setShowQuick(false);
    const ts = new Date().toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" });
    setMsgs(m => [...m, { role:"user", text:txt, time:ts }]);
    setInput("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    // FIX: evita atualização de estado em componente desmontado
    if (!mounted.current) return;
    const ana = buildAnalysis(txt);
    setMsgs(m => [...m, {
      role: "ai", time: ts,
      // FIX: input do usuário escapado antes de ser embutido como HTML
      text: ana ? null : `Analisando **"${escapeHtml(txt)}"**. Para dados em tempo real e análise completa, acesse o plano Pro.`,
      analysis: ana,
    }]);
    setLoading(false);
  };

  const render = (t) => t
    .replace(/\*\*(.*?)\*\*/g, `<span style="color:${T.green};font-weight:600">$1</span>`)
    .replace(/\n/g, "<br/>");

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* HEADER */}
      <div style={{ padding:"14px 16px 12px", borderBottom:`1px solid ${T.border}`,
        background:"#000", display:"flex", alignItems:"center", gap:12 }}>
        <Owl size={36} pulse />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700, letterSpacing:-0.3 }}>Akira</div>
          <div style={{ fontSize:11, color:T.green, display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:T.green,
              animation:"blink 1.5s ease-in-out infinite" }} />
            Analista IA · Online agora
          </div>
        </div>
        <div style={{ background:"rgba(34,197,94,0.07)", border:`1px solid rgba(34,197,94,0.2)`,
          borderRadius:8, padding:"4px 10px", fontSize:10, color:T.green, fontWeight:700,
          fontFamily:"'JetBrains Mono', monospace" }}>∞ PRO</div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px", background:"#000" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            display:"flex", flexDirection:"column",
            alignItems: m.role === "user" ? "flex-end" : "flex-start",
            marginBottom:16, animation:"msgIn 0.28s ease",
          }}>
            {m.role === "ai" && (
              <div style={{ display:"flex", alignItems:"flex-end", gap:8, maxWidth:"92%" }}>
                <Owl size={26} />
                <div>
                  {m.text && (
                    <div style={{
                      background:T.card, border:`1px solid ${T.border}`,
                      borderRadius:"14px 14px 14px 3px",
                      padding:"12px 14px", fontSize:12.5, lineHeight:1.65,
                    }} dangerouslySetInnerHTML={{ __html: render(m.text) }} />
                  )}
                  {m.analysis && (
                    <div style={{
                      background:T.card, border:`1px solid ${T.border}`,
                      borderRadius:"14px 14px 14px 3px", padding:14, minWidth:268,
                    }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                        marginBottom:10, paddingBottom:10, borderBottom:`1px solid ${T.border}` }}>
                        <div>
                          <div style={{ fontSize:16, fontWeight:700, color:T.green,
                            fontFamily:"'JetBrains Mono', monospace" }}>{m.analysis.ticker}</div>
                          <div style={{ fontSize:10, color:T.textSub }}>{m.analysis.company}</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:9.5, color:T.textSub, marginBottom:2 }}>Score</div>
                          <div style={{ fontSize:17, fontWeight:700, color:T.green,
                            fontFamily:"'JetBrains Mono', monospace" }}>
                            {m.analysis.score}<span style={{ fontSize:10, color:T.textMid }}>/100</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ height:4, borderRadius:4, background:T.cardAlt, overflow:"hidden", marginBottom:12 }}>
                        <div style={{ width:`${m.analysis.score}%`, height:"100%", borderRadius:4,
                          background:`linear-gradient(to right, ${T.greenHov}, ${T.green})`,
                          boxShadow:`0 0 8px ${T.greenGlow}` }} />
                      </div>
                      {m.analysis.rows.map((r, j) => (
                        <div key={j} style={{
                          display:"flex", gap:10, marginBottom:10, paddingBottom:10,
                          borderBottom: j < m.analysis.rows.length-1 ? `1px solid ${T.border}` : "none",
                        }}>
                          <div style={{ width:26, height:26, borderRadius:7, flexShrink:0,
                            background:`${r.c}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <Ic n={r.icon} s={12} c={r.c} />
                          </div>
                          <div>
                            <div style={{ fontSize:9.5, color:T.textSub, marginBottom:2,
                              textTransform:"uppercase", letterSpacing:0.5 }}>{r.l}</div>
                            <div style={{ fontSize:11.5, lineHeight:1.5 }}>{r.v}</div>
                          </div>
                        </div>
                      ))}
                      <div style={{ display:"flex", gap:7, marginTop:4 }}>
                        <div style={{ flex:1, background:`rgba(34,197,94,0.08)`,
                          border:`1px solid rgba(34,197,94,0.25)`, borderRadius:9,
                          padding:"8px 0", textAlign:"center", fontSize:11,
                          color:T.green, fontWeight:600, cursor:"pointer" }}>✓ Comprar</div>
                        <div style={{ flex:1, background:"rgba(239,68,68,0.06)",
                          border:"1px solid rgba(239,68,68,0.18)", borderRadius:9,
                          padding:"8px 0", textAlign:"center", fontSize:11,
                          color:T.red, fontWeight:600, cursor:"pointer" }}>⏱ Aguardar</div>
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize:9.5, color:T.textMid, marginTop:4, paddingLeft:4 }}>{m.time}</div>
                </div>
              </div>
            )}
            {m.role === "user" && (
              <div style={{ maxWidth:"80%" }}>
                <div style={{
                  background:T.green, borderRadius:"14px 14px 3px 14px",
                  padding:"11px 14px", fontSize:12.5, color:"#000",
                  fontWeight:500, lineHeight:1.55,
                  boxShadow:`0 4px 20px rgba(34,197,94,0.3)`,
                }}>{m.text}</div>
                <div style={{ fontSize:9.5, color:T.textMid, marginTop:4, textAlign:"right" }}>{m.time}</div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, marginBottom:14 }}>
            <Owl size={26} />
            <div style={{ background:T.card, border:`1px solid ${T.border}`,
              borderRadius:"14px 14px 14px 3px", padding:"13px 16px",
              display:"flex", gap:5, alignItems:"center" }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <div key={i} style={{ width:6, height:6, borderRadius:"50%",
                  background:T.green, animation:`dot 1s ease-in-out ${d}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bot} />
      </div>

      {/* QUICK SUGGESTIONS */}
      {showQuick && (
        <div style={{ padding:"0 14px 10px", display:"flex", gap:7, overflowX:"auto", background:"#000" }}>
          {QUICK.map(p => (
            <button key={p} onClick={() => send(p)} style={{
              background:T.cardAlt, border:`1px solid ${T.border}`,
              borderRadius:20, padding:"6px 13px", fontSize:11,
              color:T.text, cursor:"pointer", whiteSpace:"nowrap",
              transition:"border-color 0.15s",
            }}>{p}</button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div style={{ padding:"10px 14px 14px", borderTop:`1px solid ${T.border}`,
        background:"#000", display:"flex", gap:9, alignItems:"center" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)}
          placeholder="Pergunte sobre qualquer ativo..."
          disabled={loading}
          style={{
            flex:1, background:T.cardAlt, border:`1px solid ${T.border}`,
            borderRadius:14, padding:"11px 15px", fontSize:13,
            color:T.text, outline:"none", opacity: loading ? 0.6 : 1,
          }}
        />
        {/* FIX: botão desabilitado durante carregamento */}
        <button onClick={() => send(input)} disabled={loading} style={{
          width:44, height:44, borderRadius:12, border:"none", cursor: loading ? "default" : "pointer",
          background: (input.trim() && !loading) ? T.green : T.cardAlt,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow: (input.trim() && !loading) ? `0 0 18px rgba(34,197,94,0.45)` : "none",
          transition:"all 0.18s",
        }}>
          <Ic n="send" s={15} c={(input.trim() && !loading) ? "#000" : T.textMid} />
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// SIMULATOR SCREEN
// FIX: fmtS completa (estava truncada no original)
// ═══════════════════════════════════════════════
const SLIDERS = [
  { k:"init",    label:"Aporte Inicial",      min:0,   max:500000, step:1000, fmt:v => v>=1000?`R$ ${(v/1000).toFixed(0)}k`:`R$ ${v}` },
  { k:"monthly", label:"Aporte Mensal",       min:0,   max:20000,  step:100,  fmt:v => `R$ ${v.toLocaleString("pt-BR")}` },
  { k:"months",  label:"Prazo",               min:6,   max:360,    step:6,    fmt:v => v>=12?`${Math.round(v/12)} anos`:`${v} meses` },
  { k:"rate",    label:"Rentabilidade Anual", min:0.5, max:30,     step:0.5,  fmt:v => `${v.toFixed(1)}% a.a.` },
];

const BENCHES = [
  { label:"CDI",      rate:10.5 },
  { label:"IPCA+6%",  rate:11.2 },
  { label:"Poupança", rate:7.4  },
];

const runCalc = (init, monthly, months, annualRate) => {
  const r = annualRate / 12 / 100;
  let total = init;
  const yearly = [];
  for (let i = 0; i < months; i++) {
    total = total * (1 + r) + monthly;
    if ((i + 1) % 12 === 0 || i === months - 1) {
      const yr = Math.ceil((i + 1) / 12);
      const invested = init + monthly * (i + 1);
      yearly.push({ yr, total, invested, gains: total - invested });
    }
  }
  const invested = init + monthly * months;
  return { total, invested, gains: total - invested, yearly };
};

const CalcScreen = () => {
  const [vals, setVals] = useState({ init:10000, monthly:500, months:60, rate:12 });
  const [tab,  setTab]  = useState("chart");
  const [key,  setKey]  = useState(0);

  const set = (k, v) => { setVals(p => ({...p, [k]:v})); setKey(n => n + 1); };

  const res     = runCalc(vals.init, vals.monthly, vals.months, vals.rate);
  const benches = BENCHES.map(b => ({...b, ...runCalc(vals.init, vals.monthly, vals.months, b.rate)}));
  const maxB    = Math.max(res.total, ...benches.map(b => b.total));

  const fmt = v => v >= 1e6
    ? `R$ ${(v/1e6).toFixed(2).replace(".",",")}M`
    : `R$ ${v.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  // FIX: função fmtS estava truncada no original
  const fmtS = v => v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : v >= 1e3 ? `${(v/1e3).toFixed(0)}k` : v.toFixed(0);

  const gainPct    = res.invested > 0 ? ((res.gains/res.invested)*100).toFixed(1) : "0.0";
  const multiplier = res.invested > 0 ? (res.total/res.invested).toFixed(2) : "1.00";
  const step       = res.yearly.length > 20 ? 2 : 1;
  const chartPts   = res.yearly.filter((_,i) => i%step===0 || i===res.yearly.length-1);
  const chartMax   = chartPts.length ? Math.max(...chartPts.map(p=>p.total)) : 1;

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end",
        marginBottom:16, animation:"fadeUp 0.3s ease" }}>
        <div>
          <div style={{ fontSize:20, fontWeight:700, letterSpacing:-0.5 }}>Simulador</div>
          <div style={{ fontSize:11, color:T.textSub }}>Juros compostos inteligente</div>
        </div>
        <div style={{ background:"rgba(34,197,94,0.07)", border:`1px solid rgba(34,197,94,0.2)`,
          borderRadius:8, padding:"4px 10px", fontSize:10, color:T.green, fontWeight:700,
          fontFamily:"'JetBrains Mono', monospace" }}>PRO</div>
      </div>

      {/* SLIDERS */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18,
        padding:18, marginBottom:12, animation:"fadeUp 0.4s ease" }}>
        {SLIDERS.map((sl, i) => {
          const pct = ((vals[sl.k]-sl.min)/(sl.max-sl.min))*100;
          return (
            <div key={sl.k} style={{ marginBottom: i<SLIDERS.length-1 ? 22 : 0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontSize:10.5, color:T.textSub, textTransform:"uppercase", letterSpacing:0.4 }}>{sl.label}</span>
                <span style={{ fontSize:13, fontWeight:700, color:T.text,
                  fontFamily:"'JetBrains Mono', monospace" }}>{sl.fmt(vals[sl.k])}</span>
              </div>
              <div style={{ position:"relative", height:34, display:"flex", alignItems:"center" }}>
                <div style={{ position:"absolute", left:0, right:0, height:3, borderRadius:3, background:T.cardAlt }} />
                <div style={{ position:"absolute", left:0, width:`${pct}%`, height:3, borderRadius:3,
                  background:T.green, boxShadow:`0 0 8px rgba(34,197,94,0.5)` }} />
                <div style={{
                  position:"absolute", left:`calc(${pct}% - 9px)`,
                  width:18, height:18, borderRadius:"50%",
                  background:T.green, border:`2px solid #000`,
                  boxShadow:`0 0 10px rgba(34,197,94,0.6)`,
                  pointerEvents:"none",
                }} />
                <input type="range" min={sl.min} max={sl.max} step={sl.step} value={vals[sl.k]}
                  onChange={e => set(sl.k, parseFloat(e.target.value))}
                  style={{ position:"absolute", left:0, right:0, width:"100%", height:34,
                    opacity:0, cursor:"pointer", margin:0 }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
                <span style={{ fontSize:8.5, color:T.textMid, fontFamily:"'JetBrains Mono', monospace" }}>{sl.fmt(sl.min)}</span>
                <span style={{ fontSize:8.5, color:T.textMid, fontFamily:"'JetBrains Mono', monospace" }}>{sl.fmt(sl.max)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RESULT HERO */}
      <div key={key} style={{
        background:T.card, border:`1px solid rgba(34,197,94,0.25)`,
        borderRadius:18, padding:18, marginBottom:12,
        animation:"fadeUp 0.25s ease", position:"relative", overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", left:0, right:0, height:"1px",
          background:"linear-gradient(to right, transparent, rgba(34,197,94,0.2), transparent)",
          animation:"scanline 6s linear infinite", pointerEvents:"none",
        }} />
        <div style={{ fontSize:10, color:T.textSub, textTransform:"uppercase",
          letterSpacing:0.7, marginBottom:6, fontFamily:"'JetBrains Mono', monospace" }}>
          Patrimônio em {vals.months>=12?`${Math.round(vals.months/12)} anos`:`${vals.months} meses`}
        </div>
        <div style={{ fontSize:34, fontWeight:700, color:T.green, letterSpacing:-1.5,
          fontFamily:"'JetBrains Mono', monospace", lineHeight:1, marginBottom:5 }}>
          {fmt(res.total)}
        </div>
        <div style={{ fontSize:11, color:T.textSub, marginBottom:16 }}>
          multiplicou <span style={{ color:T.green, fontWeight:700 }}>{multiplier}×</span> o capital
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {[
            { l:"Investido",  v:fmt(res.invested), c:T.text  },
            { l:"Rendimento", v:fmt(res.gains),    c:T.green },
            { l:"Retorno",    v:`+${gainPct}%`,    c:T.green },
          ].map(m => (
            <div key={m.l} style={{ background:T.cardAlt, borderRadius:10, padding:"10px 10px" }}>
              <div style={{ fontSize:9, color:T.textSub, marginBottom:4,
                textTransform:"uppercase", letterSpacing:0.3 }}>{m.l}</div>
              <div style={{ fontSize:11, fontWeight:700, color:m.c,
                fontFamily:"'JetBrains Mono', monospace", wordBreak:"break-all" }}>{m.v}</div>
            </div>
          ))}
        </div>
        <div style={{ height:7, borderRadius:5, overflow:"hidden", display:"flex", gap:2 }}>
          <div style={{ flex:res.invested, background:"rgba(255,255,255,0.1)" }} />
          <div style={{ flex:res.gains,
            background:`linear-gradient(to right, ${T.greenHov}, ${T.green})`,
            boxShadow:`0 0 8px ${T.greenGlow}` }} />
        </div>
        <div style={{ display:"flex", gap:14, marginTop:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:2, background:"rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize:9.5, color:T.textSub }}>Aportado ({(res.invested/res.total*100).toFixed(0)}%)</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:2, background:T.green }} />
            <span style={{ fontSize:9.5, color:T.textSub }}>Juros ({(res.gains/res.total*100).toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display:"flex", gap:5, marginBottom:12,
        background:T.card, borderRadius:12, padding:4, border:`1px solid ${T.border}` }}>
        {[["chart","📈 Gráfico"],["compare","⚖️ Comparar"],["table","📋 Tabela"]].map(([id,lbl]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex:1, padding:"8px 4px", borderRadius:9, border:"none", cursor:"pointer",
            background: tab===id ? "rgba(34,197,94,0.12)" : "transparent",
            color: tab===id ? T.green : T.textMid,
            fontSize:10.5, fontWeight: tab===id ? 700 : 400, transition:"all 0.18s",
          }}>{lbl}</button>
        ))}
      </div>

      {/* CHART TAB */}
      {tab === "chart" && (
        <div key={`c-${key}`} style={{ background:T.card, border:`1px solid ${T.border}`,
          borderRadius:18, padding:16, marginBottom:12, animation:"fadeUp 0.28s ease" }}>
          <div style={{ fontSize:12, fontWeight:600, marginBottom:3 }}>Crescimento Ano a Ano</div>
          <div style={{ fontSize:10, color:T.textSub, marginBottom:14 }}>Aportado + Juros acumulados</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:96 }}>
            {chartPts.map((p, i) => {
              const last = i === chartPts.length-1;
              const totH = (p.total/chartMax)*100;
              const invH = (p.invested/p.total)*100;
              return (
                <div key={i} style={{ flex:1, height:"100%", display:"flex",
                  flexDirection:"column", justifyContent:"flex-end", alignItems:"center", gap:3 }}>
                  <div style={{ width:"100%", height:`${totH}%`, borderRadius:"3px 3px 0 0",
                    position:"relative", overflow:"hidden",
                    boxShadow: last ? `0 0 12px rgba(34,197,94,0.5)` : "none" }}>
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:`${invH}%`,
                      background: last ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)" }} />
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:`${100-invH}%`,
                      background: last ? `linear-gradient(to bottom, ${T.green}, ${T.greenHov})` : `rgba(34,197,94,0.35)` }} />
                  </div>
                  <span style={{ fontSize:7.5, color: last ? T.green : T.textMid,
                    fontFamily:"'JetBrains Mono', monospace" }}>{p.yr}a</span>
                </div>
              );
            })}
          </div>
          {res.yearly.length > 1 && (
            <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${T.border}` }}>
              <div style={{ fontSize:10.5, fontWeight:600, color:T.textSub, marginBottom:10 }}>Marcos</div>
              {[
                { label:"1 ano",   data:res.yearly.find(y=>y.yr===1) },
                { label:"Metade",  data:res.yearly[Math.floor(res.yearly.length/2)] },
                { label:"Objetivo",data:res.yearly[res.yearly.length-1] },
              ].filter(m=>m.data).map((m,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"8px 10px",
                  background: i===2 ? "rgba(34,197,94,0.06)" : T.cardAlt,
                  borderRadius:10, marginBottom:6,
                  border: i===2 ? `1px solid rgba(34,197,94,0.2)` : `1px solid ${T.border}` }}>
                  <span style={{ fontSize:11, color: i===2 ? T.green : T.textMid }}>{m.label}</span>
                  <span style={{ fontSize:12, fontWeight:700, color: i===2 ? T.green : T.text,
                    fontFamily:"'JetBrains Mono', monospace" }}>{fmt(m.data.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COMPARE TAB */}
      {tab === "compare" && (
        <div key={`b-${key}`} style={{ background:T.card, border:`1px solid ${T.border}`,
          borderRadius:18, padding:16, marginBottom:12, animation:"fadeUp 0.28s ease" }}>
          <div style={{ fontSize:12, fontWeight:600, marginBottom:3 }}>Vs. Benchmarks</div>
          <div style={{ fontSize:10, color:T.textSub, marginBottom:16 }}>Mesmo aporte e prazo</div>
          {[
            { label:"Sua Simulação", rate:vals.rate, total:res.total, isYou:true },
            ...benches,
          ].sort((a,b)=>b.total-a.total).map((item,i) => {
            const barW = (item.total/maxB)*100;
            return (
              <div key={item.label} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    {item.isYou && <span style={{ fontSize:9, background:"rgba(34,197,94,0.12)",
                      color:T.green, borderRadius:5, padding:"1px 6px", fontWeight:700 }}>VOCÊ</span>}
                    <span style={{ fontSize:11.5, fontWeight: item.isYou ? 600 : 400,
                      color: item.isYou ? T.text : T.textSub }}>{item.label}</span>
                    <span style={{ fontSize:10, color:T.textMid,
                      fontFamily:"'JetBrains Mono', monospace" }}>{item.rate}%</span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700,
                    color: item.isYou ? T.green : T.textSub,
                    fontFamily:"'JetBrains Mono', monospace" }}>{fmt(item.total)}</span>
                </div>
                <div style={{ height:7, borderRadius:4, background:T.cardAlt, overflow:"hidden" }}>
                  <div style={{ width:`${barW}%`, height:"100%", borderRadius:4,
                    background: item.isYou ? `linear-gradient(to right,${T.greenHov},${T.green})` : T.cardAlt,
                    boxShadow: item.isYou ? `0 0 8px ${T.greenGlow}` : "none",
                    border: item.isYou ? "none" : `1px solid ${T.border}`,
                    transition:"width 0.7s ease" }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop:4, padding:"10px 12px",
            background:"rgba(34,197,94,0.04)", border:`1px solid rgba(34,197,94,0.12)`,
            borderRadius:10, fontSize:10.5, color:T.textSub, lineHeight:1.6 }}>
            +1% ao ano adiciona{" "}
            <span style={{ color:T.green, fontWeight:600 }}>
              {fmt(runCalc(vals.init,vals.monthly,vals.months,vals.rate+1).total - res.total)}
            </span>{" "}ao patrimônio final.
          </div>
        </div>
      )}

      {/* TABLE TAB */}
      {tab === "table" && (
        <div key={`t-${key}`} style={{ background:T.card, border:`1px solid ${T.border}`,
          borderRadius:18, padding:16, marginBottom:12, animation:"fadeUp 0.28s ease" }}>
          <div style={{ fontSize:12, fontWeight:600, marginBottom:14 }}>Evolução Anual</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr 1.4fr", marginBottom:8 }}>
            {["Ano","Aportado","Patrimônio"].map(h => (
              <div key={h} style={{ fontSize:9.5, color:T.textSub, textTransform:"uppercase",
                letterSpacing:0.4, paddingBottom:8, borderBottom:`1px solid ${T.border}` }}>{h}</div>
            ))}
          </div>
          <div style={{ maxHeight:180, overflowY:"auto" }}>
            {res.yearly.map((row, i) => (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"1fr 1.4fr 1.4fr",
                padding:"8px 0",
                borderBottom: i<res.yearly.length-1 ? `1px solid ${T.border}` : "none",
                background: i===res.yearly.length-1 ? "rgba(34,197,94,0.04)" : "transparent",
              }}>
                <div style={{ fontSize:11, color:T.textMid, fontFamily:"'JetBrains Mono', monospace" }}>{row.yr}°</div>
                <div style={{ fontSize:11, fontFamily:"'JetBrains Mono', monospace" }}>{fmtS(row.invested)}</div>
                <div style={{ fontSize:11, fontWeight: i===res.yearly.length-1 ? 700 : 400,
                  color: i===res.yearly.length-1 ? T.green : T.text,
                  fontFamily:"'JetBrains Mono', monospace" }}>{fmtS(row.total)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ height:16 }} />
    </div>
  );
};

// ═══════════════════════════════════════════════
// NEWS SCREEN
// ═══════════════════════════════════════════════
const NEWS = [
  { tag:"Positivo", tc:T.green,  bg:"rgba(34,197,94,0.07)",  cat:"SELIC",      time:"12min",
    title:"Copom mantém Selic em 10,5% ao ano",
    body:"Decisão favorece renda fixa e FIIs de papel. Spread sobre inflação permanece atrativo.",
    tickers:["XPML11","MXRF11"] },
  { tag:"Negativo", tc:T.red,    bg:"rgba(239,68,68,0.07)",   cat:"Câmbio",     time:"38min",
    title:"Dólar avança e fecha acima de R$ 5,40",
    body:"Alta pressiona importadores e eleva custo de dívida em moeda estrangeira.",
    tickers:["MGLU3","VIIA3"] },
  { tag:"Neutro",   tc:T.yellow, bg:"rgba(234,179,8,0.07)",   cat:"Resultados", time:"1h",
    title:"Petrobras reporta lucro de R$ 23 bi no 1T25",
    body:"Resultado em linha com projeções. Mercado aguarda dividendos extraordinários.",
    tickers:["PETR4","PETR3"] },
  { tag:"Positivo", tc:T.green,  bg:"rgba(34,197,94,0.07)",  cat:"Tecnologia",  time:"2h",
    title:"TOTVS amplia portfólio de IA generativa",
    body:"Nova solução pode impulsionar receita recorrente e melhorar margens operacionais.",
    tickers:["TOTS3"] },
];

const NewsScreen = () => (
  <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 0" }}>
    <div style={{ marginBottom:18, animation:"fadeUp 0.3s ease" }}>
      <div style={{ fontSize:20, fontWeight:700, letterSpacing:-0.4, marginBottom:3 }}>Notícias</div>
      <div style={{ fontSize:11, color:T.textSub }}>Resumos com impacto pela Akira 🦉</div>
    </div>
    {NEWS.map((n, i) => (
      <div key={i} style={{
        background:T.card, border:`1px solid ${T.border}`,
        borderRadius:16, padding:15, marginBottom:10,
        borderLeft:`3px solid ${n.tc}`,
        animation:`fadeUp ${0.3+i*0.08}s ease`,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ display:"flex", gap:7 }}>
            <div style={{ background:n.bg, borderRadius:6, padding:"2px 9px",
              fontSize:10, color:n.tc, fontWeight:700 }}>{n.tag}</div>
            <div style={{ background:T.cardAlt, borderRadius:6, padding:"2px 9px",
              fontSize:10, color:T.textSub }}>{n.cat}</div>
          </div>
          <div style={{ fontSize:9.5, color:T.textMid, fontFamily:"'JetBrains Mono', monospace" }}>há {n.time}</div>
        </div>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:7, lineHeight:1.45 }}>{n.title}</div>
        <div style={{ fontSize:11.5, color:T.textSub, lineHeight:1.6, marginBottom:10 }}>{n.body}</div>
        <div style={{ display:"flex", gap:6 }}>
          {n.tickers.map(t => (
            <div key={t} style={{
              background:T.cardAlt, border:`1px solid ${T.border}`,
              borderRadius:6, padding:"3px 9px",
              fontSize:10, color:T.green, fontWeight:700,
              fontFamily:"'JetBrains Mono', monospace",
            }}>{t}</div>
          ))}
        </div>
      </div>
    ))}
    <div style={{ height:16 }} />
  </div>
);

// ═══════════════════════════════════════════════
// PLANS SCREEN
// ═══════════════════════════════════════════════
const PLANS = [
  { name:"Gratuito", price:"R$ 0",    period:"",     accent:T.textSub, glow:false,
    inc:["10 mensagens/dia","Simulador básico","Notícias gerais"],
    ex:["Histórico","Análises premium","Dados em tempo real"] },
  { name:"Plus",     price:"R$39,90", period:"/mês", accent:T.textMid, glow:false,
    inc:["500 mensagens/mês","Histórico completo","Simulador avançado","Notícias com IA"],
    ex:["Análises premium","Dados em tempo real"] },
  { name:"Pro",      price:"R$59,90", period:"/mês", accent:T.green,   glow:true, popular:true,
    inc:["Mensagens ilimitadas","Simulador avançado","Análises premium","Notícias com IA",
         "Dados em tempo real","Comparar ativos","Acesso antecipado"],
    ex:[] },
];

const PlansScreen = () => (
  <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 0" }}>
    <div style={{ textAlign:"center", marginBottom:22, animation:"fadeUp 0.3s ease" }}>
      <Owl size={54} pulse />
      <div style={{ fontSize:20, fontWeight:700, letterSpacing:-0.5, marginTop:10, marginBottom:4 }}>
        Escolha seu plano
      </div>
      <div style={{ fontSize:11, color:T.textSub }}>Cancele quando quiser · Sem fidelidade</div>
    </div>
    {PLANS.map((p, i) => (
      <div key={p.name} style={{
        background: p.glow ? "rgba(34,197,94,0.03)" : T.card,
        border:`1px solid ${p.glow ? "rgba(34,197,94,0.3)" : T.border}`,
        borderRadius:20, padding:20, marginBottom:12, position:"relative",
        animation:`fadeUp ${0.3+i*0.1}s ease`,
        boxShadow: p.glow ? "0 0 30px rgba(34,197,94,0.08)" : "none",
      }}>
        {p.popular && (
          <div style={{
            position:"absolute", top:-11, right:18,
            background:T.green, borderRadius:8, padding:"4px 12px",
            fontSize:9.5, fontWeight:700, color:"#000",
            boxShadow:`0 0 14px rgba(34,197,94,0.5)`,
          }}>MAIS POPULAR</div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, letterSpacing:-0.3 }}>{p.name}</div>
            <div style={{ fontSize:10, color:T.textSub }}>Akira Finance AI</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:22, fontWeight:700, color:p.accent,
              fontFamily:"'JetBrains Mono', monospace" }}>{p.price}</div>
            <div style={{ fontSize:10, color:T.textSub }}>{p.period}</div>
          </div>
        </div>
        {p.inc.map(f => (
          <div key={f} style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}>
            <div style={{ width:18, height:18, borderRadius:6,
              background:`${p.accent}18`, display:"flex", alignItems:"center",
              justifyContent:"center", flexShrink:0 }}>
              <Ic n="check" s={10} c={p.accent} />
            </div>
            <span style={{ fontSize:12 }}>{f}</span>
          </div>
        ))}
        {p.ex.map(f => (
          <div key={f} style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9, opacity:0.3 }}>
            <div style={{ width:18, height:18, borderRadius:6,
              background:T.cardAlt, display:"flex", alignItems:"center",
              justifyContent:"center", flexShrink:0 }}>
              <Ic n="lock" s={10} c={T.textMid} />
            </div>
            <span style={{ fontSize:12, color:T.textSub }}>{f}</span>
          </div>
        ))}
        <button style={{
          width:"100%", marginTop:14, borderRadius:12, padding:"12px 0",
          border: p.glow ? "none" : `1px solid ${p.accent}`,
          background: p.glow ? T.green : "transparent",
          color: p.glow ? "#000" : p.accent,
          fontSize:13, fontWeight:700, cursor:"pointer",
          boxShadow: p.glow ? `0 0 20px rgba(34,197,94,0.35)` : "none",
        }}>
          {p.name === "Gratuito" ? "Plano Atual" : (
            <a href={STRIPE_LINKS[p.name.toLowerCase()]} target="_blank" rel="noopener noreferrer"
              style={{ color:"inherit", textDecoration:"none", width:"100%", display:"block" }}>
              Assinar {p.name}
            </a>
          )}
        </button>
      </div>
    ))}
    <div style={{ height:16 }} />
  </div>
);

// ═══════════════════════════════════════════════
// PROFILE SCREEN
// FIX: onSignOut prop adicionada ao botão "Sair da conta"
// FIX: "Ver tudo" agora navega para o chat
// ═══════════════════════════════════════════════
const ProfileScreen = ({ go, onSignOut }) => {
  const [notify,   setNotify]   = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [haptic,   setHaptic]   = useState(true);

  const Toggle = ({ val, onToggle }) => (
    <div onClick={onToggle} style={{
      width:44, height:24, borderRadius:12, cursor:"pointer",
      background: val ? "#22C55E" : "#27272A",
      position:"relative", transition:"background 0.2s",
      boxShadow: val ? "0 0 10px rgba(34,197,94,0.4)" : "none",
      flexShrink:0,
    }}>
      <div style={{
        position:"absolute", top:3, left: val ? 23 : 3,
        width:18, height:18, borderRadius:"50%",
        background:"#fff", transition:"left 0.2s",
        boxShadow:"0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </div>
  );

  const historyItems = [
    { q:"Vale a pena investir em PETR4?",       time:"Hoje, 09:41"  },
    { q:"Qual a diferença entre FII e ETF?",    time:"Ontem, 15:22" },
    { q:"Simular R$500/mês por 5 anos",         time:"Seg, 11:08"   },
  ];

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:22, animation:"fadeUp 0.3s ease" }}>
        <div style={{ fontSize:20, fontWeight:700, letterSpacing:-0.4 }}>Perfil</div>
        <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)",
          borderRadius:8, padding:"4px 10px", fontSize:10, color:"#22C55E", fontWeight:700,
          fontFamily:"'JetBrains Mono',monospace" }}>PRO</div>
      </div>

      {/* User card */}
      <div style={{ background:"#111", border:"1px solid #27272A", borderRadius:20,
        padding:18, marginBottom:14, display:"flex", alignItems:"center", gap:14,
        animation:"fadeUp 0.4s ease" }}>
        <div style={{ width:60, height:60, borderRadius:"50%", overflow:"hidden",
          border:"2px solid rgba(34,197,94,0.4)",
          boxShadow:"0 0 16px rgba(34,197,94,0.2)", flexShrink:0 }}>
          <Owl size={60} />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:16, fontWeight:700, marginBottom:2 }}>Rafael Silva</div>
          <div style={{ fontSize:12, color:"#71717A" }}>rafael@email.com</div>
          <div style={{ fontSize:11, color:"#22C55E", marginTop:4, fontWeight:600 }}>Plano Pro · Ativo</div>
        </div>
      </div>

      {/* Meta */}
      <div style={{ background:"#111", border:"1px solid #27272A", borderRadius:18,
        padding:16, marginBottom:12, animation:"fadeUp 0.45s ease" }}>
        <div style={{ fontSize:12, fontWeight:600, marginBottom:12 }}>Meta Financeira 2025</div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:11, color:"#A1A1AA" }}>Patrimônio alvo</span>
          <span style={{ fontSize:12, fontWeight:700, color:"#22C55E",
            fontFamily:"'JetBrains Mono',monospace" }}>R$ 70.000</span>
        </div>
        <div style={{ height:8, borderRadius:4, background:"#1A1A1A", overflow:"hidden", marginBottom:6 }}>
          <div style={{ width:"68%", height:"100%", borderRadius:4,
            background:"linear-gradient(to right,#16A34A,#22C55E)",
            boxShadow:"0 0 8px rgba(34,197,94,0.4)" }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:10, color:"#71717A" }}>R$ 48.320 atingidos</span>
          <span style={{ fontSize:10, color:"#22C55E", fontWeight:600 }}>68%</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8,
        marginBottom:12, animation:"fadeUp 0.5s ease" }}>
        {[
          { l:"Perguntas",  v:"142" },
          { l:"Simulações", v:"38"  },
          { l:"Dias ativo", v:"47"  },
        ].map(s => (
          <div key={s.l} style={{ background:"#111", border:"1px solid #27272A",
            borderRadius:14, padding:"12px 10px", textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:800, color:"#22C55E",
              fontFamily:"'JetBrains Mono',monospace" }}>{s.v}</div>
            <div style={{ fontSize:9.5, color:"#71717A", marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Histórico */}
      <div style={{ background:"#111", border:"1px solid #27272A", borderRadius:18,
        padding:16, marginBottom:12, animation:"fadeUp 0.55s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:600 }}>Histórico de Conversas</div>
          {/* FIX: "Ver tudo" agora navega para o chat */}
          <span style={{ fontSize:10, color:"#22C55E", cursor:"pointer" }}
            onClick={() => go("chat")}>Ver tudo →</span>
        </div>
        {historyItems.map((h, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", gap:10,
            paddingBottom: i<2?12:0, marginBottom: i<2?12:0,
            borderBottom: i<2?"1px solid #27272A":"none",
          }}>
            <div style={{ width:32, height:32, borderRadius:10,
              background:"rgba(34,197,94,0.08)", display:"flex", alignItems:"center",
              justifyContent:"center", flexShrink:0, fontSize:14 }}>💬</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:500, marginBottom:2,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{h.q}</div>
              <div style={{ fontSize:10, color:"#71717A" }}>{h.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Configurações */}
      <div style={{ background:"#111", border:"1px solid #27272A", borderRadius:18,
        padding:16, marginBottom:12, animation:"fadeUp 0.6s ease" }}>
        <div style={{ fontSize:12, fontWeight:600, marginBottom:14 }}>Configurações</div>
        {[
          { label:"Notificações de mercado", icon:"🔔", val:notify,   set:() => setNotify(v=>!v)   },
          { label:"Modo escuro",             icon:"🌙", val:darkMode, set:() => setDarkMode(v=>!v) },
          { label:"Feedback tátil",          icon:"📳", val:haptic,   set:() => setHaptic(v=>!v)   },
        ].map((item, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            paddingBottom: i<2?14:0, marginBottom: i<2?14:0,
            borderBottom: i<2?"1px solid #27272A":"none",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <span style={{ fontSize:13 }}>{item.label}</span>
            </div>
            <Toggle val={item.val} onToggle={item.set} />
          </div>
        ))}
      </div>

      {/* Watchlist */}
      <div style={{ background:"#111", border:"1px solid #27272A", borderRadius:18,
        padding:16, marginBottom:12, animation:"fadeUp 0.65s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:600 }}>⭐ Watchlist</div>
          <span style={{ fontSize:10, color:"#22C55E", cursor:"pointer" }}>+ Adicionar</span>
        </div>
        {[
          { t:"PETR4",  v:"R$38,90", c:"+3,2%", pos:true  },
          { t:"MXRF11", v:"R$11,42", c:"+1,7%", pos:true  },
          { t:"IVVB11", v:"R$312",   c:"-0,4%", pos:false },
        ].map((a, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            paddingBottom: i<2?12:0, marginBottom: i<2?12:0,
            borderBottom: i<2?"1px solid #27272A":"none",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:9,
                background:"#1A1A1A", border:"1px solid #27272A",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:8, fontWeight:700, color:"#22C55E",
                  fontFamily:"'JetBrains Mono',monospace" }}>{a.t.slice(0,2)}</span>
              </div>
              <span style={{ fontSize:12, fontWeight:600 }}>{a.t}</span>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>{a.v}</div>
              <div style={{ fontSize:10, color: a.pos?"#22C55E":"#EF4444", fontWeight:600 }}>{a.c}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Plano */}
      <div style={{ background:"rgba(34,197,94,0.04)", border:"1px solid rgba(34,197,94,0.2)",
        borderRadius:18, padding:16, marginBottom:12, animation:"fadeUp 0.7s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700 }}>Plano Pro</div>
            <div style={{ fontSize:11, color:"#71717A", marginTop:2 }}>Renova em 15/07/2025</div>
          </div>
          <button onClick={() => go("plans")} style={{
            background:"#22C55E", border:"none", borderRadius:10,
            padding:"8px 14px", fontSize:12, fontWeight:700, color:"#000", cursor:"pointer",
          }}>Gerenciar</button>
        </div>
      </div>

      {/* FIX: "Sair da conta" agora chama onSignOut */}
      <button onClick={onSignOut} style={{
        width:"100%", background:"transparent", border:"1px solid #27272A",
        borderRadius:14, padding:"13px 0", fontSize:13, color:"#71717A",
        cursor:"pointer", marginBottom:8,
      }}>Sair da conta</button>
      <div style={{ height:16 }} />
    </div>
  );
};

// ═══════════════════════════════════════════════
// WELCOME / LOGIN / SIGNUP SCREEN
// FIX: botões da tela welcome navegam para login/signup (não direto para o app)
// FIX: Google/Apple OAuth com handler placeholder
// ═══════════════════════════════════════════════
const WelcomeScreen = ({ onEnter }) => {
  const [view,     setView]     = useState("welcome");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async () => {
    if (!email || !pass) return setError("Preencha e-mail e senha.");
    setLoading(true); setError("");
    const { error: e } = await supabase.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if (e) return setError(e.message);
    onEnter();
  };

  const handleSignup = async () => {
    if (!name || !email || !pass) return setError("Preencha todos os campos.");
    if (pass.length < 8) return setError("Senha deve ter mínimo 8 caracteres.");
    setLoading(true); setError("");
    const { error: e } = await supabase.auth.signUp({
      email, password: pass,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (e) return setError(e.message);
    onEnter();
  };

  const inputStyle = {
    width:"100%", background:"#111111", border:"1px solid #27272A",
    borderRadius:14, padding:"14px 16px", fontSize:14, color:"#fff",
    outline:"none", fontFamily:"'Space Grotesk', sans-serif", transition:"border-color 0.2s",
  };
  const btnPrimary = {
    width:"100%", background:"#22C55E", border:"none",
    borderRadius:14, padding:"15px 0", fontSize:15, fontWeight:700,
    color:"#000", cursor:"pointer", letterSpacing:0.2,
    boxShadow:"0 0 24px rgba(34,197,94,0.4)",
    fontFamily:"'Space Grotesk', sans-serif",
  };
  const btnOutline = {
    width:"100%", background:"transparent", border:"1px solid #27272A",
    borderRadius:14, padding:"14px 0", fontSize:14, fontWeight:600,
    color:"#fff", cursor:"pointer", fontFamily:"'Space Grotesk', sans-serif",
    display:"flex", alignItems:"center", justifyContent:"center", gap:10,
    transition:"border-color 0.2s",
  };

  const handleOAuth = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider: provider.toLowerCase(),
      options: { redirectTo: window.location.href },
    });
  };

  // ── WELCOME ──────────────────────────────────
  if (view === "welcome") return (
    <div style={{ flex:1, display:"flex", flexDirection:"column",
      background:"#000", overflow:"hidden", position:"relative", height:"100%" }}>
      <div style={{
        position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)",
        width:320, height:320, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
        pointerEvents:"none",
      }} />
      <div style={{ flex:1, minHeight:0, overflowY:"auto",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding:"40px 24px 20px", animation:"fadeUp 0.5s ease" }}>
        <div style={{
          width:160, height:160, borderRadius:"50%", overflow:"hidden",
          border:"2px solid rgba(34,197,94,0.3)",
          boxShadow:"0 0 40px rgba(34,197,94,0.2), 0 0 80px rgba(34,197,94,0.08)",
          marginBottom:28,
          animation:"owlPulse 3s ease-in-out infinite, owlFloat 4s ease-in-out infinite",
        }}>
          <Owl size={160} pulse />
        </div>
        <div style={{ textAlign:"center", marginBottom:12 }}>
          <div style={{ fontSize:38, fontWeight:800, letterSpacing:-1.5, lineHeight:1, marginBottom:6 }}>
            <span style={{ color:"#fff" }}>Akira</span>
            <span style={{ color:"#22C55E" }}>.</span>
          </div>
          <div style={{ fontSize:13, color:"#A1A1AA", letterSpacing:0.3, lineHeight:1.5 }}>
            IA para Investidores
          </div>
        </div>
        <div style={{ fontSize:15, color:"#fff", textAlign:"center",
          lineHeight:1.6, maxWidth:260, marginBottom:8, fontWeight:500 }}>
          "Entenda. Analise.{" "}
          <span style={{ color:"#22C55E", fontWeight:700 }}>Invista melhor.</span>"
        </div>
        <div style={{ display:"flex", gap:20, marginTop:24, padding:"14px 20px",
          background:"#111111", border:"1px solid #27272A", borderRadius:16 }}>
          {[{ v:"20k+", l:"Usuários" },{ v:"98%", l:"Satisfação" },{ v:"24/7", l:"Online" }].map((s,i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:16, fontWeight:800, color:"#22C55E",
                fontFamily:"'JetBrains Mono', monospace" }}>{s.v}</div>
              <div style={{ fontSize:10, color:"#71717A", marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:"24px 24px 36px",
        background:"linear-gradient(to top, #000 80%, transparent)",
        animation:"fadeUp 0.6s ease", flexShrink:0 }}>
        {/* FIX: botões navegam para signup/login — não pulam o fluxo */}
        <button style={btnPrimary} onClick={() => setView("signup")}>
          Criar conta grátis
        </button>
        <div style={{ height:12 }} />
        <button style={{...btnOutline, color:"#A1A1AA"}} onClick={() => setView("login")}>
          Já tenho conta — Entrar
        </button>
        <div style={{ height:20 }} />
        <div style={{ textAlign:"center", fontSize:11, color:"#71717A", lineHeight:1.6 }}>
          Ao continuar você aceita os{" "}
          <span style={{ color:"#22C55E" }}>Termos de Uso</span>
          {" "}e a{" "}
          <span style={{ color:"#22C55E" }}>Política de Privacidade</span>
        </div>
      </div>
    </div>
  );

  // ── LOGIN ─────────────────────────────────────
  const fieldWrap  = { position:"relative", marginBottom:14 };
  const fieldIcon  = { position:"absolute", left:15, top:"50%", transform:"translateY(-50%)",
    pointerEvents:"none", color:"#52525B" };
  const fieldInput = { ...inputStyle, background:"#161616", padding:"15px 16px 15px 44px" };

  if (view === "login") return (
    <div style={{ flex:1, display:"flex", flexDirection:"column",
      background:"#000", overflowY:"auto", position:"relative" }}>
      <button onClick={() => setView("welcome")} style={{
        position:"absolute", top:16, left:18, zIndex:3,
        width:38, height:38, borderRadius:"50%",
        background:"rgba(255,255,255,0.04)", border:"1px solid #27272A",
        color:"#A1A1AA", fontSize:16, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>←</button>
      <div style={{ flexShrink:0, position:"relative",
        display:"flex", flexDirection:"column", alignItems:"center",
        padding:"52px 24px 34px", animation:"fadeUp 0.4s ease" }}>
        <div style={{
          position:"absolute", top:-30, left:"50%", transform:"translateX(-50%)",
          width:260, height:260, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(34,197,94,0.13) 0%, transparent 70%)",
          pointerEvents:"none",
        }} />
        <div style={{ width:78, height:78, borderRadius:"50%", overflow:"hidden",
          border:"2px solid rgba(34,197,94,0.35)",
          boxShadow:"0 0 28px rgba(34,197,94,0.25)",
          animation:"owlFloat 4s ease-in-out infinite" }}>
          <Owl size={78} />
        </div>
        <div style={{ fontSize:26, fontWeight:800, letterSpacing:-0.6, marginTop:16 }}>
          Bem-vindo de volta
        </div>
        <div style={{ fontSize:13, color:"#71717A", marginTop:5 }}>
          Entre para continuar investindo melhor
        </div>
      </div>
      <div style={{ flex:1, background:"#0B0B0B",
        borderTop:"1px solid #1A1A1A", borderRadius:"28px 28px 0 0",
        padding:"26px 22px 24px", boxShadow:"0 -12px 40px rgba(0,0,0,0.55)",
        animation:"fadeUp 0.5s ease" }}>
        {/* FIX: Google OAuth com handler */}
        <button style={{ ...btnOutline, background:"#161616", borderRadius:16, padding:"14px 0" }}
          onClick={() => handleOAuth("Google")}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar com Google
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
          <div style={{ flex:1, height:1, background:"#1F1F22" }} />
          <span style={{ fontSize:11, color:"#52525B" }}>ou com e-mail</span>
          <div style={{ flex:1, height:1, background:"#1F1F22" }} />
        </div>
        <div style={fieldWrap}>
          <svg style={fieldIcon} width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>
          </svg>
          <input value={email} onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com" type="email" style={fieldInput} />
        </div>
        <div style={{ ...fieldWrap, marginBottom:16 }}>
          <svg style={fieldIcon} width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input value={pass} onChange={e => setPass(e.target.value)}
            placeholder="Sua senha" type={showPass?"text":"password"}
            style={{ ...fieldInput, paddingRight:64 }} />
          <button onClick={() => setShowPass(s => !s)} style={{
            position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", color:"#71717A", cursor:"pointer", fontSize:11,
          }}>{showPass?"ocultar":"ver"}</button>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
          <button onClick={() => setRemember(r => !r)} style={{
            display:"flex", alignItems:"center", gap:8, background:"none",
            border:"none", cursor:"pointer", padding:0,
          }}>
            <div style={{
              width:18, height:18, borderRadius:6,
              background: remember ? "#22C55E" : "transparent",
              border:`1.5px solid ${remember?"#22C55E":"#3F3F46"}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.15s",
            }}>
              {remember && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="#000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
            <span style={{ fontSize:12.5, color:"#A1A1AA" }}>Lembrar de mim</span>
          </button>
          <span style={{ fontSize:12.5, color:"#22C55E", fontWeight:600, cursor:"pointer" }}>
            Esqueci a senha
          </span>
        </div>
        {error && <div style={{ color:"#EF4444", fontSize:12, marginBottom:12, textAlign:"center" }}>{error}</div>}
        <button style={{ ...btnPrimary, borderRadius:16, opacity: loading ? 0.7 : 1 }}
          onClick={handleLogin} disabled={loading}>{loading ? "Entrando…" : "Entrar →"}</button>
        <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"#71717A" }}>
          Não tem conta?{" "}
          <span style={{ color:"#22C55E", fontWeight:600, cursor:"pointer" }}
            onClick={() => { setError(""); setView("signup"); }}>Criar grátis</span>
        </div>
        <div style={{ height:8 }} />
      </div>
    </div>
  );

  // ── SIGNUP ────────────────────────────────────
  if (view === "signup") return (
    <div style={{ flex:1, display:"flex", flexDirection:"column",
      background:"#000", padding:"0 24px", overflowY:"auto" }}>
      <div style={{ paddingTop:20, paddingBottom:24, animation:"fadeUp 0.35s ease" }}>
        <button onClick={() => setView("welcome")} style={{
          background:"none", border:"none", color:"#A1A1AA",
          fontSize:13, cursor:"pointer", padding:0, marginBottom:24,
          display:"flex", alignItems:"center", gap:6,
        }}>← Voltar</button>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
          <div style={{ width:42, height:42, borderRadius:"50%", overflow:"hidden",
            border:"1.5px solid rgba(34,197,94,0.3)" }}>
            <Owl size={42} />
          </div>
          <div>
            <div style={{ fontSize:20, fontWeight:800, letterSpacing:-0.5 }}>Criar conta</div>
            <div style={{ fontSize:12, color:"#71717A" }}>Grátis · Sem cartão</div>
          </div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", animation:"fadeUp 0.45s ease" }}>
        {/* FIX: Google OAuth com handler */}
        <button style={btnOutline} onClick={() => handleOAuth("Google")}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar com Google
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"16px 0" }}>
          <div style={{ flex:1, height:1, background:"#27272A" }} />
          <span style={{ fontSize:11, color:"#71717A" }}>ou</span>
          <div style={{ flex:1, height:1, background:"#27272A" }} />
        </div>
        {/* FIX: Apple OAuth com handler */}
        <button style={{ ...btnOutline, marginBottom:16 }} onClick={() => handleOAuth("Apple")}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/>
          </svg>
          Continuar com Apple
        </button>
        {[
          { label:"Nome completo", placeholder:"Rafael Silva",        type:"text",     val:name,  set:setName  },
          { label:"E-mail",        placeholder:"seu@email.com",       type:"email",    val:email, set:setEmail },
          { label:"Senha",         placeholder:"Mínimo 8 caracteres", type:"password", val:pass,  set:setPass  },
        ].map(f => (
          <div key={f.label} style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, color:"#A1A1AA", display:"block",
              marginBottom:7, textTransform:"uppercase", letterSpacing:0.5 }}>{f.label}</label>
            <input placeholder={f.placeholder} type={f.type} value={f.val}
              onChange={e => f.set(e.target.value)} style={inputStyle} />
          </div>
        ))}
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:11, color:"#A1A1AA", display:"block",
            marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>Plano inicial</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[
              { name:"Grátis", sub:"10 msg/dia",  active:true  },
              { name:"Pro",    sub:"R$59,90/mês", active:false },
            ].map(p => (
              <div key={p.name} style={{
                background: p.active?"rgba(34,197,94,0.08)":"#111",
                border:`1px solid ${p.active?"rgba(34,197,94,0.4)":"#27272A"}`,
                borderRadius:12, padding:"12px 14px", cursor:"pointer",
              }}>
                <div style={{ fontSize:13, fontWeight:700,
                  color: p.active?"#22C55E":"#fff" }}>{p.name}</div>
                <div style={{ fontSize:10, color:"#71717A", marginTop:2 }}>{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
        {error && <div style={{ color:"#EF4444", fontSize:12, marginBottom:12, textAlign:"center" }}>{error}</div>}
        <button style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}
          onClick={handleSignup} disabled={loading}>{loading ? "Criando conta…" : "Criar minha conta →"}</button>
        <div style={{ textAlign:"center", marginTop:16, marginBottom:8, fontSize:13, color:"#71717A" }}>
          Já tem conta?{" "}
          <span style={{ color:"#22C55E", fontWeight:600, cursor:"pointer" }}
            onClick={() => { setError(""); setView("login"); }}>Entrar</span>
        </div>
        <div style={{ height:8 }} />
      </div>
    </div>
  );
  return null;
};

// ═══════════════════════════════════════════════
// SPLASH SCREEN
// ═══════════════════════════════════════════════
const SplashScreen = () => (
  <div style={{ flex:1, display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", background:"#000" }}>
    <div style={{
      width:110, height:110, borderRadius:"50%", overflow:"hidden",
      border:"2px solid rgba(34,197,94,0.4)",
      boxShadow:"0 0 60px rgba(34,197,94,0.3)",
      animation:"splashPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
      marginBottom:22,
    }}>
      <Owl size={110} />
    </div>
    <div style={{ fontSize:36, fontWeight:800, letterSpacing:-1.5, animation:"fadeUp 0.5s 0.3s ease both" }}>
      Akira<span style={{ color:"#22C55E" }}>.</span>
    </div>
    <div style={{ fontSize:12, color:"#71717A", letterSpacing:1.5, marginTop:4,
      textTransform:"uppercase", animation:"fadeUp 0.5s 0.5s ease both" }}>
      IA para Investidores
    </div>
    <div style={{ position:"absolute", bottom:60, display:"flex", gap:6,
      animation:"fadeUp 0.5s 0.8s ease both" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:6, height:6, borderRadius:"50%",
          background: i===0?"#22C55E":"#27272A",
          animation:`splashDot 1.2s ${i*0.2}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════
// ONBOARDING
// FIX: key movida do style para o elemento JSX — animação reinicia corretamente
// ═══════════════════════════════════════════════
const SLIDES = [
  { title:"Sua analista com IA",
    sub:"Akira analisa ações, FIIs, ETFs e responde qualquer dúvida sobre investimentos em segundos." },
  { title:"Simule seu futuro",
    sub:"Calcule quanto seu dinheiro rende com juros compostos e compare com CDI, IPCA e Poupança." },
  { title:"Notícias que importam",
    sub:"Resumos de mercado gerados por IA com impacto positivo, negativo ou neutro para sua carteira." },
];

const OnboardingScreen = ({ onDone }) => {
  const [slide, setSlide] = useState(0);
  const s      = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#000", overflow:"hidden" }}>
      <div style={{ display:"flex", justifyContent:"flex-end", padding:"16px 20px 0" }}>
        {!isLast && (
          <button onClick={onDone} style={{
            background:"none", border:"none", color:"#71717A",
            fontSize:13, cursor:"pointer",
          }}>Pular</button>
        )}
      </div>
      {/* FIX: key no elemento JSX para reiniciar animação a cada slide */}
      <div key={slide} style={{
        flex:1, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"0 32px", textAlign:"center",
        animation:"fadeUp 0.4s ease",
      }}>
        <div style={{ width:90, height:90, borderRadius:"50%", overflow:"hidden",
          border:"2px solid rgba(34,197,94,0.3)",
          boxShadow:"0 0 30px rgba(34,197,94,0.2)", marginBottom:28 }}>
          <Owl size={90} />
        </div>
        <div style={{ fontSize:24, fontWeight:800, letterSpacing:-0.5,
          marginBottom:14, lineHeight:1.2 }}>{s.title}</div>
        <div style={{ fontSize:14, color:"#A1A1AA", lineHeight:1.7, maxWidth:280 }}>{s.sub}</div>
      </div>
      <div style={{ padding:"20px 24px 36px" }}>
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:24 }}>
          {SLIDES.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)} style={{
              height:4, borderRadius:4, cursor:"pointer",
              width: i===slide ? 24 : 8,
              background: i===slide ? "#22C55E" : "#27272A",
              transition:"all 0.3s ease",
              boxShadow: i===slide ? "0 0 8px rgba(34,197,94,0.5)" : "none",
            }} />
          ))}
        </div>
        <button onClick={() => isLast ? onDone() : setSlide(s => s+1)} style={{
          width:"100%", background:"#22C55E", border:"none",
          borderRadius:14, padding:"15px 0", fontSize:15, fontWeight:700,
          color:"#000", cursor:"pointer", boxShadow:"0 0 24px rgba(34,197,94,0.4)",
        }}>
          {isLast ? "Começar agora →" : "Próximo →"}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// APP ROOT
// FIX: removidos prevActive e slideDir (não usados)
// FIX: renderização lazy — apenas a tela ativa é montada
// FIX: "plans" adicionado ao mapa de telas (acessível via ProfileScreen)
// FIX: onSignOut reseta para fase "welcome"
// ═══════════════════════════════════════════════
export default function App() {
  const [phase,  setPhase]  = useState("splash");
  const [active, setActive] = useState("home");
  const [notifCount]        = useState(3);

  // Verifica sessão Supabase existente no carregamento
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setPhase("app");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) setPhase("welcome");
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (phase === "splash") {
      const t = setTimeout(() => setPhase("onboarding"), 2200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const goTab = (tab) => setActive(tab);

  // FIX: lazy rendering — só monta a tela ativa
  const renderScreen = () => {
    switch (active) {
      case "home":    return <HomeScreen    go={goTab} />;
      case "chat":    return <ChatScreen />;
      case "calc":    return <CalcScreen />;
      case "news":    return <NewsScreen />;
      case "plans":   return <PlansScreen />;
      case "profile": return <ProfileScreen go={goTab} onSignOut={() => setPhase("welcome")} />;
      default:        return <HomeScreen    go={goTab} />;
    }
  };

  const tabs = [
    { id:"home",    icon:"home",    label:"Home"    },
    { id:"chat",    icon:"chat",    label:"Akira"   },
    { id:"calc",    icon:"calc",    label:"Simular" },
    { id:"news",    icon:"news",    label:"News"    },
    { id:"profile", icon:"profile", label:"Perfil"  },
  ];

  return (
    <>
      <style>{CSS + `
        @keyframes splashPop {
          from { opacity:0; transform:scale(0.5); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes splashDot {
          0%,100% { opacity:0.3; transform:scale(0.8); }
          50%     { opacity:1;   transform:scale(1.2); background:#22C55E; }
        }
        @keyframes screenIn {
          from { opacity:0; transform:translateX(18px); }
          to   { opacity:1; transform:translateX(0); }
        }
      `}</style>
      <div style={{
        width:"min(390px, 100vw)", height:"min(844px, 100dvh)", maxHeight:"100dvh",
        margin:"0 auto", background:"#000", borderRadius:50,
        display:"flex", flexDirection:"column", overflow:"hidden", position:"relative",
        boxShadow:"0 0 0 1px #27272A, 0 40px 100px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}>

        {/* STATUS BAR */}
        {phase !== "splash" && (
          <div style={{ padding:"15px 26px 0", display:"flex",
            justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
            <span style={{ fontSize:12, fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>9:41</span>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <div style={{ display:"flex", gap:2, alignItems:"flex-end" }}>
                {[3,4,5,6].map(h => (
                  <div key={h} style={{ width:3, height:h,
                    background:"rgba(255,255,255,0.4)", borderRadius:1 }} />
                ))}
              </div>
              <div style={{ width:15, height:8, border:"1px solid rgba(255,255,255,0.25)",
                borderRadius:2, position:"relative" }}>
                <div style={{ position:"absolute", left:1, top:1, width:"72%",
                  height:"calc(100% - 2px)", background:"#22C55E", borderRadius:1 }} />
              </div>
            </div>
          </div>
        )}

        {/* SPLASH */}
        {phase === "splash" && <SplashScreen />}

        {/* ONBOARDING */}
        {phase === "onboarding" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <OnboardingScreen onDone={() => setPhase("welcome")} />
          </div>
        )}

        {/* WELCOME / LOGIN / SIGNUP */}
        {phase === "welcome" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minHeight:0 }}>
            <WelcomeScreen onEnter={() => setPhase("app")} />
          </div>
        )}

        {/* MAIN APP */}
        {phase === "app" && (
          <>
            <div style={{ flex:1, display:"flex", flexDirection:"column",
              overflow:"hidden", paddingBottom:82, animation:"screenIn 0.3s ease" }}>
              {renderScreen()}
            </div>

            {/* BOTTOM NAV */}
            <div style={{
              position:"absolute", bottom:0, left:0, right:0,
              background:"#000", borderTop:"1px solid #27272A",
              display:"flex", padding:"10px 0 20px",
            }}>
              {tabs.map(t => {
                // FIX: "plans" não tem tab, mas profile fica ativo mesmo quando em plans
                const on = active === t.id || (t.id === "profile" && active === "plans");

                if (t.id === "profile") return (
                  <button key={t.id} onClick={() => goTab("profile")} style={{
                    flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                    background:"none", border:"none", cursor:"pointer",
                    color: on ? "#22C55E" : "#71717A",
                  }}>
                    <div style={{ position:"relative" }}>
                      <div style={{
                        width:28, height:28, borderRadius:"50%", overflow:"hidden",
                        border: on ? "2px solid #22C55E" : "2px solid #27272A",
                        transition:"border-color 0.2s",
                        boxShadow: on ? "0 0 8px rgba(34,197,94,0.4)" : "none",
                      }}>
                        <Owl size={28} />
                      </div>
                    </div>
                    <span style={{ fontSize:9.5, fontWeight: on?600:400 }}>Perfil</span>
                  </button>
                );

                if (t.id === "news") return (
                  <button key={t.id} onClick={() => goTab(t.id)} style={{
                    flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                    background:"none", border:"none", cursor:"pointer",
                    color: on ? "#22C55E" : "#71717A", transition:"color 0.18s",
                  }}>
                    <div style={{ position:"relative" }}>
                      <div style={{
                        width:42, height:30, borderRadius:10, display:"flex",
                        alignItems:"center", justifyContent:"center",
                        background: on ? "rgba(34,197,94,0.1)" : "transparent",
                      }}>
                        <Ic n={t.icon} s={18} c={on ? "#22C55E" : "#71717A"} />
                      </div>
                      <NotifBadge count={notifCount} />
                    </div>
                    <span style={{ fontSize:9.5, fontWeight: on?600:400 }}>{t.label}</span>
                  </button>
                );

                return (
                  <button key={t.id} onClick={() => goTab(t.id)} style={{
                    flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                    background:"none", border:"none", cursor:"pointer",
                    color: on ? "#22C55E" : "#71717A", transition:"color 0.18s",
                  }}>
                    <div style={{
                      width:42, height:30, borderRadius:10, display:"flex",
                      alignItems:"center", justifyContent:"center",
                      background: on ? "rgba(34,197,94,0.1)" : "transparent",
                      transition:"background 0.18s",
                    }}>
                      <Ic n={t.icon} s={18} c={on ? "#22C55E" : "#71717A"} />
                    </div>
                    <span style={{ fontSize:9.5, fontWeight: on?600:400 }}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
