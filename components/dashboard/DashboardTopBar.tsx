"use client";

import Link from "next/link";
import { Search, LocateFixed, Loader2, Type, Eye, MapPin } from "lucide-react";
import { useSettings, Language } from "@/context/SettingsContext";
import { getTranslation } from "@/lib/translations";
import { Logo } from "@/components/ui/Logo";

interface DashboardTopBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onLocate: () => void;
  locating: boolean;
  onOpenMap?: () => void;
}

export default function DashboardTopBar({
  query,
  onQueryChange,
  onLocate,
  locating,
  onOpenMap,
}: DashboardTopBarProps) {
  const {
    language,
    setLanguage,
    largeText,
    setLargeText,
    highContrast,
    setHighContrast,
  } = useSettings();

  const t = getTranslation(language).dashboard;

  return (
    <header className="surface flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Logo className="h-8 w-8" />
        <span className="hidden font-display text-lg font-semibold tracking-tight sm:block">
          Saarthi <span className="text-primary">AI</span>
        </span>
      </div>

      <div className="relative flex-1 sm:max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Language Selector */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="appearance-none rounded-xl border border-border bg-background px-4 py-2.5 pr-8 text-sm font-medium text-ink focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Accessibility Buttons */}
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background p-1">
          <button
            onClick={() => setLargeText(!largeText)}
            title="Large Text Mode"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              largeText ? "bg-primary/10 text-primary" : "text-muted hover:bg-background hover:text-ink"
            }`}
            aria-label="Toggle Large Text"
          >
            <Type className="h-4 w-4" />
          </button>

          <button
            onClick={() => setHighContrast(!highContrast)}
            title="High Contrast Mode"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              highContrast ? "bg-primary/10 text-primary" : "text-muted hover:bg-background hover:text-ink"
            }`}
            aria-label="Toggle High Contrast"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={onLocate}
          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-ink hover:bg-background"
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4 text-primary" />
          )}
          {t.currentLocation}
        </button>

        {onOpenMap && (
          <button
            onClick={onOpenMap}
            className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            Open Map
          </button>
        )}
      </div>
    </header>
  );
}
