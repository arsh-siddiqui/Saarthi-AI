"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import AISidebar from "@/components/dashboard/AISidebar";
import QuickActions from "@/components/dashboard/QuickActions";
import DashboardHero from "@/components/dashboard/DashboardHero";
import { CIVIC_SERVICES, MUMBAI_CENTER } from "@/data/markers";
import { CATEGORY_META, CivicService, ServiceCategory } from "@/types";
import { useGeolocation } from "@/hooks/useGeolocation";

const CivicMap = dynamic(() => import("@/components/map/CivicMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted">
      Loading map…
    </div>
  ),
});

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");
  const [aiPrompt, setAiPrompt] = useState<string | null>(null);
  const [aiContext, setAiContext] = useState<string | undefined>(undefined);
  const [showMap, setShowMap] = useState(false);
  const { coords, loading: locating, error: locationError, locate } = useGeolocation();

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Natural Language Extraction
    const hasMumbai = q.includes("mumbai");
    const hasDelhi = q.includes("delhi") || q.includes("new delhi");
    const hasPune = q.includes("pune");
    const hasBengaluru = q.includes("bengaluru") || q.includes("bangalore");

    const categoryKeywords: Record<string, ServiceCategory> = {
      hospital: "hospital",
      police: "police",
      passport: "passport",
      municipal: "municipal",
      school: "school",
      blood: "blood-bank",
      post: "post-office",
      fire: "fire-station",
      phc: "phc",
    };

    let detectedCategory = activeCategory;
    if (activeCategory === "all") {
      for (const [kw, cat] of Object.entries(categoryKeywords)) {
        if (q.includes(kw)) {
          detectedCategory = cat;
          break;
        }
      }
    }

    if (!q) {
      // INITIAL LOAD: Mumbai + core categories
      return CIVIC_SERVICES.filter(
        (s) =>
          s.id.startsWith("m") &&
          (activeCategory === "all"
            ? ["hospital", "police", "passport", "municipal"].includes(s.category)
            : s.category === activeCategory)
      );
    }

    return CIVIC_SERVICES.filter((service) => {
      const matchesCategory = detectedCategory === "all" || service.category === detectedCategory;
      
      let matchesCity = true;
      if (hasMumbai) matchesCity = service.id.startsWith("m");
      else if (hasDelhi) matchesCity = service.id.startsWith("d");
      else if (hasPune) matchesCity = service.id.startsWith("p");
      else if (hasBengaluru) matchesCity = service.id.startsWith("b");

      const terms = q
        .replace(/mumbai|delhi|new delhi|pune|bengaluru|bangalore/g, "")
        .split(" ")
        .filter((t) => t.length > 2 && !Object.keys(categoryKeywords).includes(t));
        
      const termMatches = terms.length === 0 || terms.every((term) =>
          service.name.toLowerCase().includes(term) ||
          CATEGORY_META[service.category].label.toLowerCase().includes(term) ||
          (service.address && service.address.toLowerCase().includes(term))
        );

      return matchesCategory && matchesCity && termMatches;
    });
  }, [query, activeCategory]);

  function handleAskAi(service: CivicService) {
    const meta = CATEGORY_META[service.category];
    const context = `Office Name: ${service.name}
Category: ${meta.label}
Address: ${service.address}
Distance: ${service.distanceKm} km
Hours: ${service.openHours}`;

    setAiContext(context);
    setAiPrompt(
      `Provide a comprehensive guide for "${service.name}". Specifically explain:
1. What services are available here.
2. Required documents for these services.
3. Best visiting tips.
4. Common mistakes citizens make.
Use clear headers and clean formatting.`
    );
    // reset so identical repeat clicks still trigger the effect
    requestAnimationFrame(() => setAiPrompt(null));
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5">
        <DashboardTopBar
          query={query}
          onQueryChange={setQuery}
          onLocate={locate}
          locating={locating}
          onOpenMap={() => setShowMap(true)}
        />

        {locationError && (
          <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {locationError}
          </div>
        )}

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === "all"
                ? "gradient-brand text-white"
                : "surface text-muted hover:text-ink"
            }`}
          >
            All Services
          </button>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key as ServiceCategory)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === key
                  ? "text-white"
                  : "surface text-muted hover:text-ink"
              }`}
              style={activeCategory === key ? { background: meta.color } : undefined}
            >
              {meta.label}
            </button>
          ))}
        </div>

        {/* Quick actions moved to top for better accessibility */}
        <QuickActions />

        {/* Main layout: map/hero (left) + AI sidebar (right) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.7fr_1fr]">
          <div className="surface h-[520px] min-w-0 overflow-hidden p-2 lg:h-[620px]">
            {!showMap && query === "" && activeCategory === "all" ? (
              <DashboardHero onFindServices={() => setShowMap(true)} />
            ) : (
              <CivicMap
                services={filteredServices}
                center={coords ?? MUMBAI_CENTER}
                onAskAi={handleAskAi}
              />
            )}
          </div>

          <div className="h-[520px] min-w-0 lg:h-[620px]">
            <AISidebar externalPrompt={aiPrompt} externalContext={aiContext} />
          </div>
        </div>
      </div>
    </main>
  );
}
