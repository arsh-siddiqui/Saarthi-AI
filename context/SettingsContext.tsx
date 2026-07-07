"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "English" | "Hindi";

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  largeText: boolean;
  setLargeText: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("English");
  const [largeText, setLargeTextState] = useState(false);
  const [highContrast, setHighContrastState] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const savedLang = localStorage.getItem("civic-language") as Language;
    if (savedLang) setLanguageState(savedLang);

    const savedLargeText = localStorage.getItem("civic-largeText") === "true";
    setLargeTextState(savedLargeText);
    if (savedLargeText) document.documentElement.classList.add("large-text");

    const savedHighContrast = localStorage.getItem("civic-highContrast") === "true";
    setHighContrastState(savedHighContrast);
    if (savedHighContrast) document.documentElement.classList.add("high-contrast");
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("civic-language", lang);
  };

  const setLargeText = (val: boolean) => {
    setLargeTextState(val);
    localStorage.setItem("civic-largeText", String(val));
    if (val) {
      document.documentElement.classList.add("large-text");
    } else {
      document.documentElement.classList.remove("large-text");
    }
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    localStorage.setItem("civic-highContrast", String(val));
    if (val) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        largeText,
        setLargeText,
        highContrast,
        setHighContrast,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
