"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  FileCheck,
  CreditCard,
  Clock,
  Sparkles,
  CheckSquare,
  AlertCircle,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const SUGGESTIONS = ["Passport", "Driving Licence", "Birth Certificate", "Aadhaar Card", "PAN Card"];

interface DocumentChecklist {
  requiredDocuments: string[];
  estimatedFees: string;
  processingTime: string;
  importantTips: string[];
  timeline?: Record<string, string>;
}

export default function DocumentsPage() {
  const { language } = useSettings();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DocumentChecklist | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const handleSearch = async (docQuery: string) => {
    if (!docQuery.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setCheckedDocs({});

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: docQuery,
          language,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to load document info.");
      }

      setData({
        requiredDocuments: result.requiredDocuments || [],
        estimatedFees: result.estimatedFees || "N/A",
        processingTime: result.processingTime || "N/A",
        importantTips: result.importantTips || [],
        timeline: result.timeline,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error connecting to AI assistant.");
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (item: string) => {
    setQuery(item);
    void handleSearch(item);
  };

  const toggleCheck = (doc: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [doc]: !prev[doc],
    }));
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="text-right">
            <h1 className="font-display text-2xl font-bold tracking-tight">Document Assistant</h1>
            <p className="text-xs text-muted">Generate instant checklists, fees & visiting tips</p>
          </div>
        </div>

        {/* Search & Suggestions */}
        <div className="surface p-5 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(query);
              }}
              placeholder="What document do you want? E.g., I want Passport, Driving Licence..."
              className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-32 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none"
            />
            <button
              onClick={() => handleSearch(query)}
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1.5 bottom-1.5 rounded-lg gradient-brand px-4 py-1.5 text-xs font-bold text-white disabled:opacity-40"
            >
              Get Checklist
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-muted uppercase">Suggestions:</span>
            {SUGGESTIONS.map((item) => (
              <button
                key={item}
                onClick={() => handleChipClick(item)}
                className="rounded-full surface px-3.5 py-1 text-[11px] font-semibold text-muted hover:text-ink hover:border-primary transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="surface border-danger/30 bg-danger/5 p-4 flex gap-3 text-xs text-danger rounded-2xl">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="surface p-5 md:col-span-2 space-y-4 min-h-[300px]">
              <div className="h-4 bg-border rounded w-1/3" />
              <div className="space-y-2 mt-4">
                <div className="h-3 bg-border rounded w-full" />
                <div className="h-3 bg-border rounded w-5/6" />
                <div className="h-3 bg-border rounded w-4/5" />
                <div className="h-3 bg-border rounded w-full" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="surface p-5 space-y-2">
                <div className="h-4 bg-border rounded w-1/2" />
                <div className="h-3 bg-border rounded w-2/3 mt-2" />
              </div>
              <div className="surface p-5 space-y-2">
                <div className="h-4 bg-border rounded w-1/2" />
                <div className="h-3 bg-border rounded w-2/3 mt-2" />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Checklist Card */}
            <div className="surface p-5 md:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
                  <CheckSquare className="h-4.5 w-4.5 text-primary" /> Required Documents Checklist
                </h3>
              </div>

              {data.requiredDocuments.length === 0 ? (
                <p className="text-xs text-muted">No specific documents listed.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {data.requiredDocuments.map((doc, index) => (
                    <button
                      key={index}
                      onClick={() => toggleCheck(doc)}
                      className={`flex items-start text-left gap-3 p-3 rounded-xl border transition-all ${
                        checkedDocs[doc]
                          ? "border-success/30 bg-success/5 text-muted line-through"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!checkedDocs[doc]}
                        onChange={() => {}} // handled by parent onClick
                        className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary pointer-events-none"
                      />
                      <span className="text-xs font-medium text-ink">{doc}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Timeline */}
              {data.timeline && (
                <div className="mt-8">
                  <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2 mb-4">
                    <Sparkles className="h-4.5 w-4.5 text-primary" /> Application Journey
                  </h3>
                  <div className="relative border-l-2 border-primary/20 ml-3 space-y-6">
                    {["Eligibility", "Documents", "Application", "Verification", "Approval", "Completed"].map((step, idx) => {
                      if (!data.timeline![step]) return null;
                      return (
                        <div key={idx} className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background bg-primary shadow-sm" />
                          <h4 className="text-xs font-bold text-ink uppercase tracking-wider">{step}</h4>
                          <p className="text-xs text-muted mt-1 leading-relaxed">{data.timeline![step]}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Side column: Fees, Timeline, Tips */}
            <div className="space-y-6">
              {/* Cost & Timeline */}
              <div className="surface p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CreditCard className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-[10px] font-bold text-muted uppercase">Estimated Fees</h4>
                    <p className="text-xs font-semibold text-ink mt-0.5">{data.estimatedFees}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-[10px] font-bold text-muted uppercase">Processing Time</h4>
                    <p className="text-xs font-semibold text-ink mt-0.5">{data.processingTime}</p>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="surface p-5 space-y-3">
                <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" /> Important Tips
                </h4>
                <ul className="space-y-2.5">
                  {data.importantTips.map((tip, index) => (
                    <li key={index} className="flex gap-2 text-xs leading-relaxed text-ink">
                      <span className="text-primary font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!data && !loading && (
          <div className="surface p-12 text-center border-2 border-dashed border-border flex flex-col items-center justify-center space-y-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-border text-muted">
              <FileCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-bold text-ink">Type a government document name above</p>
              <p className="text-[10px] text-muted max-w-xs mt-1">
                We&apos;ll generate a personalized checklist of documents, costs, timelines, and expert application tips.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Loader icon helper
function Loader2({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
