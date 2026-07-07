"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { getTranslation } from "@/lib/translations";
import DemoTourModal from "@/components/layout/DemoTourModal";
import { Logo } from "@/components/ui/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const { language } = useSettings();
  const t = getTranslation(language).navbar;

  const NAV_LINKS = [
    { label: t.platform, href: "/#platform" },
    { label: t.howItWorks, href: "/#how-it-works" },
    { label: t.services, href: "/#services" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl"
    >
      <div
        className={`flex items-center justify-between rounded-2xl border border-border bg-white px-5 py-3 transition-shadow ${
          scrolled ? "shadow-elevated" : "shadow-soft"
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-9 w-9" />
          <span className="font-display text-lg font-semibold tracking-tight">
            Saarthi <span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setDemoOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/20 transition-colors"
          >
            <Sparkles className="h-4 w-4" /> Demo Mode
          </button>
          <Link
            href="/dashboard"
            className="rounded-xl gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow hover:opacity-90 transition-opacity"
          >
            {t.openDashboard}
          </Link>
        </div>

        <button
          className="md:hidden rounded-lg p-2 hover:bg-background"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="mt-2 rounded-2xl border border-border bg-white p-4 shadow-elevated md:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                setDemoOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary"
            >
              <Sparkles className="h-4 w-4" /> Demo Mode
            </button>
            <Link
              href="/dashboard"
              className="rounded-xl gradient-brand px-4 py-2 text-center text-sm font-semibold text-white"
            >
              {t.openDashboard}
            </Link>
          </div>
        </div>
      )}

      <DemoTourModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </motion.header>
  );
}
