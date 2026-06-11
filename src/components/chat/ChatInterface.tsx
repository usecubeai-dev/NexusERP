"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Plus,
  MessageSquare,
  ChevronRight,
  Zap,
  Search,
} from "lucide-react";
import MessageBubble, { Message } from "./MessageBubble";

const SAMPLE_CONVERSATIONS = [
  {
    id: "1",
    title: "Análise de PETR4",
    preview: "P/L 5.2, DY 14.3%...",
    time: "14:32",
    active: true,
  },
  {
    id: "2",
    title: "Melhores FIIs de 2024",
    preview: "HGLG11, KNRI11...",
    time: "11:10",
    active: false,
  },
  {
    id: "3",
    title: "Renda Fixa vs Variável",
    preview: "Comparação de retornos...",
    time: "09:45",
    active: false,
  },
  {
    id: "4",
    title: "Carteira diversificada",
    preview: "Sugestão de alocação...",
    time: "Ontem",
    active: false,
  },
  {
    id: "5",
    title: "Análise de VALE3",
    preview: "ROE 21%, P/L 6.1...",
    time: "Ontem",
    active: false,
  },
  {
    id: "6",
    title: "Selic e impactos",
    preview: "Com Selic a 10.5%...",
    time: "Seg",
    active: false,
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Olá! Sou a Akira AI, seu copiloto de investimentos. Estou pronta para ajudar com análises de ações, FIIs, renda fixa, e muito mais. Como posso te ajudar hoje?",
    timestamp: "14:30",
  },
  {
    id: "2",
    role: "user",
    content: "Pode me dar uma análise fundamentalista da PETR4?",
    timestamp: "14:31",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "PETR4 — Petrobras PN\n\nAnálise Fundamentalista (Dados simulados)\n\nIndicadores Principais:\n• P/L: 5.2x (abaixo da média setorial de 8.1x)\n• P/VP: 1.8x\n• DY (Dividend Yield): 14.3% nos últimos 12 meses\n• ROE: 21.8%\n• Margem EBITDA: 42.1%\n\nPontos Fortes:\n• Dividend yield muito atrativo para renda passiva\n• Forte geração de caixa com barril acima de US$70\n• Liderança no pré-sal brasileiro\n\nRiscos:\n• Exposição a risco político (empresa estatal)\n• Volatilidade cambial afeta resultado\n• Dependência do preço do petróleo\n\nRecomendação: Compra moderada para perfil de renda. Adequada para carteiras que buscam dividendos consistentes.",
    timestamp: "14:32",
  },
  {
    id: "4",
    role: "user",
    content: "E VALE3? Vale a pena entrar agora?",
    timestamp: "14:33",
  },
  {
    id: "5",
    role: "assistant",
    content:
      "VALE3 — Vale S.A. ON\n\nAnálise de Entrada (Dados simulados)\n\nMomento Atual:\n• Preço atual: R$ 61,40\n• P/L: 6.1x — historicamente barato\n• DY projetado: 11.2% para 2024\n• EV/EBITDA: 4.3x\n\nContexto de Mercado:\n• Minério de ferro a US$118/ton (estável)\n• Demanda chinesa mostrando recuperação gradual\n• Produção de minério batendo recordes no 1T24\n\nCatalisadores Positivos:\n• Retomada de dividendos extraordinários possível\n• Programa de recompra de ações ativo\n• Valuation em múltiplos historicamente descontados\n\nRiscos:\n• Desaceleração econômica da China\n• Câmbio desfavorável (BRL/USD)\n\nConclusão: Para horizonte de 12-18 meses, os fundamentos sugerem potencial de valorização relevante. Sugiro entrada gradual (compras parciais) para diluir o risco de timing.",
    timestamp: "14:34",
  },
];

const QUICK_SUGGESTIONS = [
  "Análise de PETR4",
  "Melhores FIIs",
  "Renda Fixa vs Variável",
  "Carteira diversificada",
];

const AI_RESPONSES: { [key: string]: string } = {
  default: `Entendido! Com base nos dados disponíveis, vou analisar sua pergunta sobre investimentos.\n\nEsta é uma simulação da Akira AI. Em produção, utilizaria modelos de linguagem avançados integrados a dados de mercado em tempo real para fornecer:\n\n• Análise técnica e fundamentalista\n• Indicadores financeiros atualizados\n• Comparação com benchmarks do setor\n• Recomendações baseadas no seu perfil\n\nComo posso ajudar mais especificamente?`,
  fiis: `Melhores FIIs para 2024 (Dados simulados)\n\nFIIs de Logística:\n• HGLG11 — DY 9.2%, vacância 3.1%\n• BRCO11 — DY 8.7%, contratos atípicos\n\nFIIs de Escritórios:\n• KNRI11 — DY 8.9%, portfólio premium SP/RJ\n• BRCR11 — DY 10.1%, desconto sobre VPA\n\nFIIs de Shopping:\n• XPML11 — DY 9.8%, expansão de portfólio\n\nFIIs de CRI (Paper):\n• MXRF11 — DY 13.1%, carteira diversificada\n• KNCR11 — DY 12.4%, CDI+spreads\n\nDica: Para carteiras mais conservadoras, FIIs de papel (CRI) oferecem maior previsibilidade. Para valorização no longo prazo, FIIs de tijolo com boa gestão são mais indicados.`,
  rendafixa: `Renda Fixa vs Renda Variável — Comparação Atual\n\nRenda Fixa (Dados simulados):\n• Selic: 10.5% a.a.\n• CDB 100% CDI (1 ano): ~10.3% líquido\n• Tesouro IPCA+ 2029: IPCA + 5.8%\n• LCI/LCA (isento IR): 8.9-9.5%\n\nRenda Variável (Ibovespa histórico):\n• Retorno médio 10 anos: ~12-15% a.a.\n• Volatilidade anual: ~25-30%\n\nAnálise por Perfil:\n🟢 Conservador: 70-80% RF + 20-30% RV\n🟡 Moderado: 40-60% RF + 40-60% RV\n🔴 Arrojado: 20% RF + 80% RV\n\nCom a Selic em 10.5%, a renda fixa está especialmente atrativa. Mas com a perspectiva de queda de juros, alocar em Tesouro IPCA+ pode ser uma estratégia interessante de médio prazo.`,
  carteira: `Sugestão de Carteira Diversificada — Perfil Moderado\n\nAlocação Sugerida (Dados simulados):\n\n📊 Renda Variável (50%):\n• PETR4 — 10% (petróleo + dividendos)\n• VALE3 — 8% (commodities)\n• ITUB4 — 7% (bancário sólido)\n• WEGE3 — 7% (industrial growth)\n• RDOR3 — 5% (saúde em expansão)\n• MGLU3 — 3% (especulativo/recuperação)\n• FII mix — 10%\n\n📈 Renda Fixa (35%):\n• Tesouro IPCA+ — 15%\n• CDB 115% CDI — 12%\n• LCI/LCA — 8%\n\n🌍 Internacional (10%):\n• ETF S&P 500 (IVVB11) — 7%\n• ETF Global Tech — 3%\n\n💰 Reserva de emergência (5%):\n• Tesouro Selic / CDB liquidez diária\n\nLembre-se: Esta é uma sugestão educacional. Ajuste conforme seu perfil, horizonte e tolerância ao risco.`,
};

function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("fii") || lower.includes("fundo imobiliário")) return AI_RESPONSES.fiis;
  if (lower.includes("renda fixa") || lower.includes("selic") || lower.includes("cdb"))
    return AI_RESPONSES.rendafixa;
  if (lower.includes("carteira") || lower.includes("diversif") || lower.includes("alocação"))
    return AI_RESPONSES.carteira;
  return AI_RESPONSES.default;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeConv, setActiveConv] = useState("1");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const content = text || inputValue.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(content),
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiResponse]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r border-border/40 bg-card/50">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border/40">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-gradient-to-br from-accent to-accent-cyan rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold gradient-text text-sm">Akira AI</span>
          </div>
          <button
            onClick={() => {
              setMessages([
                {
                  id: Date.now().toString(),
                  role: "assistant",
                  content:
                    "Olá! Nova conversa iniciada. Como posso ajudar com seus investimentos?",
                  timestamp: new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ]);
              setActiveConv("new");
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-accent/10 hover:bg-accent/20 border border-accent/20 hover:border-accent/40 text-accent text-sm font-medium rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Nova conversa
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-border/40">
          <div className="flex items-center gap-2 px-3 py-2 bg-background/60 rounded-lg border border-border/40">
            <Search className="w-3.5 h-3.5 text-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              className="bg-transparent text-xs text-text-secondary placeholder-muted outline-none w-full"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          <p className="text-xs text-muted px-2 py-1 font-medium">Recentes</p>
          {SAMPLE_CONVERSATIONS.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all group ${
                activeConv === conv.id
                  ? "bg-accent/15 border border-accent/25"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <MessageSquare
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    activeConv === conv.id ? "text-accent" : "text-muted"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-medium truncate ${
                        activeConv === conv.id ? "text-accent" : "text-text-secondary"
                      }`}
                    >
                      {conv.title}
                    </span>
                    <span className="text-xs text-muted flex-shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted truncate mt-0.5">{conv.preview}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-accent to-accent-cyan rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Zap className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-text-primary">Akira AI</h1>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse-slow" />
                  <span className="text-xs text-positive">Online</span>
                </span>
              </div>
              <p className="text-xs text-muted">Copiloto de Investimentos</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted bg-background/50 px-3 py-1.5 rounded-full border border-border/40">
            <ChevronRight className="w-3 h-3" />
            Análise de PETR4
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-cyan border border-accent/40 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="bg-card-alt border border-border/60 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-accent typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-accent typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="px-4 sm:px-6 pb-3">
          <div className="flex flex-wrap gap-2">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="px-3 py-1.5 text-xs bg-card-alt border border-border/60 hover:border-accent/40 text-text-secondary hover:text-accent rounded-full transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-end gap-3 p-3 bg-card-alt rounded-2xl border border-border/60 focus-within:border-accent/40 transition-colors shadow-lg">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre ações, FIIs, renda fixa..."
              rows={1}
              className="flex-1 bg-transparent text-text-primary text-sm placeholder-muted outline-none resize-none max-h-32 leading-relaxed py-1"
              style={{ minHeight: "24px" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className="flex-shrink-0 w-9 h-9 bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-accent/30 hover:shadow-accent/50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-xs text-muted mt-2">
            Akira AI pode cometer erros. Não constitui recomendação de investimento.
          </p>
        </div>
      </div>
    </div>
  );
}
