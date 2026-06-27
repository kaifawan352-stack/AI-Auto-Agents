import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, User, Bot, AlertTriangle, ArrowRight } from "lucide-react";
import { AgentProfile, ChatMessage } from "../types";
import { useLanguage } from "../contexts/LanguageContext";

interface SandboxProps {
  selectedAgentId: string;
  onSelectAgentId: (id: string) => void;
}

export default function Sandbox({ selectedAgentId, onSelectAgentId }: SandboxProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agentProfiles: AgentProfile[] = [
    {
      id: "web_chatbot",
      name: "SiteAgent",
      title: t("pWebTitle"),
      description: t("pWebDesc"),
      badge: t("servicesBadge1"),
      platform: "Web",
      avatarColor: "bg-emerald-500",
      suggestedPrompts: [
        t("pWebQ1"),
        t("pWebQ2"),
        t("pWebQ3")
      ]
    },
    {
      id: "whatsapp_insta",
      name: "SocialAgent",
      title: t("pSocialTitle"),
      description: t("pSocialDesc"),
      badge: t("servicesBadge2"),
      platform: "WhatsApp",
      avatarColor: "bg-teal-500",
      suggestedPrompts: [
        t("pSocialQ1"),
        t("pSocialQ2"),
        t("pSocialQ3")
      ]
    },
    {
      id: "email_chatbot",
      name: "InboxAgent",
      title: t("pEmailTitle"),
      description: t("pEmailDesc"),
      badge: t("servicesBadge3"),
      platform: "Email",
      avatarColor: "bg-emerald-400",
      suggestedPrompts: [
        t("pEmailQ1"),
        t("pEmailQ2"),
        t("pEmailQ3")
      ]
    },
    {
      id: "b2b_leadgen",
      name: "LeadScout",
      title: t("pB2bTitle"),
      description: t("pB2bDesc"),
      badge: t("servicesBadge4"),
      platform: "B2B Outreach",
      avatarColor: "bg-teal-400",
      suggestedPrompts: [
        t("pB2bQ1"),
        t("pB2bQ2"),
        t("pB2bQ3")
      ]
    },
    {
      id: "lead_qualification",
      name: "BANT Diagnostic Agent",
      title: t("pBantTitle"),
      description: t("pBantDesc"),
      badge: t("servicesBadge5"),
      platform: "Web",
      avatarColor: "bg-emerald-300",
      suggestedPrompts: [
        t("pBantQ1"),
        t("pBantQ2"),
        t("pBantQ3")
      ]
    }
  ];

  const activeAgent = agentProfiles.find(a => a.id === selectedAgentId) || agentProfiles[0];

  function getWelcomeMessage(id: string, name: string): string {
    switch (id) {
      case "web_chatbot":
        return t("pWelcomeWeb");
      case "whatsapp_insta":
        return t("pWelcomeSocial");
      case "email_chatbot":
        return t("pWelcomeEmail");
      case "b2b_leadgen":
        return t("pWelcomeB2b");
      case "lead_qualification":
        return t("pWelcomeBant");
      default:
        return t("pWelcomeDefault");
    }
  }

  // Initialize/Reset conversation when active agent changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: getWelcomeMessage(activeAgent.id, activeAgent.name),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setApiError(null);
  }, [selectedAgentId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputMessage.trim();
    if (!messageText || isLoading) return;

    if (!textToSend) {
      setInputMessage("");
    }

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    setApiError(null);

    try {
      // Map ChatMessage structure to server expected schema
      const payload = {
        agentType: activeAgent.id,
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to communicate with the agent backend.");
      }

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          id: `reply_${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || t("sandboxErrorKey"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="playroom" className="bg-zinc-50 dark:bg-zinc-950 py-24 border-b border-zinc-200 dark:border-zinc-900 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
            {t("navSandbox")}
          </h2>
          <p className="mt-4 font-sans text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            {t("sandboxTitle")}
          </p>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            {t("sandboxSub")}
          </p>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Panel: Agent Selectors & Details */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block px-1">
              {t("sandboxActiveProfile")}
            </span>
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-white dark:bg-zinc-900/40 shadow-lg shadow-emerald-500/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {activeAgent.title}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-950/40">
                  {activeAgent.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {activeAgent.description}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-mono text-zinc-500">{t("sandboxStatus")}:</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse inline-block"></span>
                  {t("sandboxOnline")}
                </span>
              </div>
            </div>

            {/* Selected Agent Technical Details */}
            <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/10 p-5 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                  {t("sandboxMetadata")}
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-50 dark:bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800/60">
                    <span className="text-[10px] text-zinc-500 block">Ident Label</span>
                    <span className="font-mono text-zinc-900 dark:text-white font-semibold">{activeAgent.name}</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800/60">
                    <span className="text-[10px] text-zinc-500 block">{t("sandboxLLM")}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Gemini 3.5</span>
                  </div>
                </div>
              </div>

              {/* Suggested Prompts / Seed Instructions */}
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                  {t("sandboxTestCommands")}
                </span>
                <div className="flex flex-col gap-2">
                  {activeAgent.suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p)}
                      disabled={isLoading}
                      className="text-left text-xs bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel: Chat Interface */}
          <div className="lg:col-span-8 flex flex-col rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 backdrop-blur-sm overflow-hidden min-h-[500px] lg:min-h-[600px] max-h-[700px] shadow-sm">
            
            {/* Chat Header */}
            <div className="border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/60 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${activeAgent.avatarColor} text-zinc-950 font-bold shadow-md shadow-emerald-500/5`}>
                  <Bot className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {activeAgent.title}
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    {t("sandboxIdentifier")}: @{activeAgent.name.toLowerCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setMessages([
                    {
                      id: "welcome",
                      role: "assistant",
                      content: getWelcomeMessage(activeAgent.id, activeAgent.name),
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                  setApiError(null);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 transition-colors cursor-pointer"
              >
                {t("sandboxClear")}
              </button>
            </div>

            {/* Chat Conversation Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                       isUser ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700" : `${activeAgent.avatarColor} text-zinc-950`
                    }`}>
                      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
                      <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser 
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tr-none border border-zinc-200 dark:border-zinc-700/50" 
                          : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none"
                      }`}>
                        {/* Preserve layout/whitespace for formatted response scripts/emails */}
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      </div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-600 font-mono px-1">
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3.5 mr-auto max-w-[85%] animate-pulse">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${activeAgent.avatarColor} text-zinc-950`}>
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="rounded-2xl px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-tl-none">
                      <div className="flex items-center gap-1.5 py-1">
                        <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Alert Box */}
              {apiError && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex gap-3 items-start max-w-xl mx-auto">
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-red-200 block">Agent Pipeline Error</span>
                    <p className="text-xs text-red-400 mt-1">{apiError}</p>
                    <span className="block text-[10px] text-zinc-500 mt-2 font-mono">
                      {apiError.toLowerCase().includes("key") || apiError.toLowerCase().includes("secret")
                        ? "Please check that your GEMINI_API_KEY is configured in AI Studio Secrets!"
                        : "This is a transient model availability issue. Please try sending your message again."}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/40 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                  placeholder={`${t("sandboxInputPlaceholder")}`}
                  className="flex-1 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-350 dark:hover:border-zinc-700 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-colors focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-zinc-950 transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-500/10 disabled:opacity-40 disabled:scale-100 cursor-pointer"
                >
                  <Send className="h-4 w-4 stroke-[2.2]" />
                </button>
              </form>
              <div className="flex items-center justify-between mt-2.5 px-1.5">
                <span className="text-[10px] text-zinc-600 font-mono">
                  {t("sandboxPressEnter")}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-zinc-600 font-mono">
                  <Sparkles className="h-3 w-3 text-emerald-500/80" />
                  {t("sandboxBackedBy")}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
