"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  History,
  HelpCircle,
  FileCheck,
  Building,
  Navigation,
} from "lucide-react";
import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";
import { getTranslation } from "@/lib/translations";
import { useSettings } from "@/context/SettingsContext";
import StructuredResponse from "./StructuredResponse";

const SUGGESTED_QUESTIONS = [
  "Passport Renewal",
  "Birth Certificate",
  "Scholarship Finder",
  "Find Hospital",
  "Driving Licence",
  "Report Garbage",
  "Report Pothole"
];

interface AISidebarProps {
  externalPrompt?: string | null;
  externalContext?: string;
}

export default function AISidebar({ externalPrompt, externalContext }: AISidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentChats, setRecentChats] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { language } = useSettings();
  const t = getTranslation(language).sidebar;

  // Overriding translations temporarily to use the hardcoded new suggestions for demo
  const SUGGESTIONS = SUGGESTED_QUESTIONS;

  // Load recent conversations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("civic-recent-chats");
    if (saved) {
      try {
        setRecentChats(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (externalPrompt) {
      void sendMessage(externalPrompt, externalContext);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrompt]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const saveRecentChat = (text: string) => {
    const updated = [text, ...recentChats.filter((t) => t !== text)].slice(0, 5);
    setRecentChats(updated);
    localStorage.setItem("civic-recent-chats", JSON.stringify(updated));
  };

  async function sendMessage(text: string, context?: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    saveRecentChat(trimmed);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, context, language }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reach the assistant.");
    } finally {
      setLoading(false);
    }
  }

  const handleQuickAction = (actionType: "explain" | "services" | "docs") => {
    if (actionType === "explain") {
      sendMessage(
        "Explain what services are available at the currently selected office on the map, and how citizens should prepare."
      );
    } else if (actionType === "services") {
      sendMessage("What government services are typically available in Mumbai and how to locate them?");
    } else if (actionType === "docs") {
      sendMessage(
        "What are the general documents required for government services in India (e.g. identity, address proofs)?"
      );
    }
  };

  const hasStarted = messages.length > 0;

  return (
    <div
      id="ai-sidebar"
      className="surface-elevated flex h-full flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-ink">{t.title}</p>
            <p className="text-xs text-muted">{t.active}: {language}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {!hasStarted ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">
                {t.greeting}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {t.intro}
              </p>
            </div>

            {/* Suggested Questions (Chips) */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-muted uppercase flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Suggestions
              </span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => sendMessage(question)}
                    className="surface px-3 py-1.5 rounded-full text-[11px] font-semibold text-ink border border-border hover:border-primary hover:bg-primary/5 transition-all shadow-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-muted uppercase flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> {t.quickActions}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickAction("explain")}
                  className="surface flex flex-col items-center justify-center p-3 text-center gap-1.5 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Building className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-semibold text-ink">{t.explainOffice}</span>
                </button>
                <button
                  onClick={() => handleQuickAction("services")}
                  className="surface flex flex-col items-center justify-center p-3 text-center gap-1.5 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Navigation className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-semibold text-ink">{t.nearbyInfo}</span>
                </button>
                <button
                  onClick={() => handleQuickAction("docs")}
                  className="surface flex flex-col items-center justify-center p-3 text-center gap-1.5 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <FileCheck className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-semibold text-ink">{t.documentHelp}</span>
                </button>
              </div>
            </div>

            {/* Recent Conversations */}
            {recentChats.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold tracking-wider text-muted uppercase flex items-center gap-1">
                  <History className="h-3.5 w-3.5 text-primary" /> {t.recentQueries}
                </span>
                <div className="flex flex-col gap-1.5">
                  {recentChats.map((chat, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(chat)}
                      className="text-left text-xs text-muted hover:text-ink truncate py-1 border-b border-border/50 hover:border-primary/30 transition-colors"
                    >
                      {chat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-2.5",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                      msg.role === "user" ? "bg-ink text-white" : "gradient-brand text-white"
                    )}
                  >
                    {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </span>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed relative group",
                      msg.role === "user"
                        ? "bg-ink text-white"
                        : "border border-border bg-background text-ink w-full"
                    )}
                  >
                    {typeof msg.content === 'string' ? msg.content : <StructuredResponse data={msg.content} />}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t.thinking}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-xs text-danger">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex items-center gap-2 border-t border-border p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.askPlaceholder}
          className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-brand text-white disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
