"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { useSettings } from "@/context/SettingsContext";
import { getTranslation } from "@/lib/translations";

export default function Footer() {
  const { language } = useSettings();
  const t = getTranslation(language).footer;

  const COLUMNS = [
    {
      title: t.platform,
      links: ["Dashboard", "Smart Map", "AI Assistant", "Complaint Tracker"],
    },
    {
      title: t.services,
      links: ["Hospitals", "Police Stations", "Passport Offices", "Municipal Offices"],
    },
    {
      title: t.legal,
      links: [t.privacy, t.terms],
    },
    {
      title: t.contact,
      links: ["Support", "Feedback", "Accessibility"],
    },
  ];

  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Logo className="h-9 w-9" />
              <span className="font-display text-lg font-semibold">
                Saarthi AI
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Your AI Civic Companion
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
               <h4 className="text-sm font-semibold text-ink">{col.title}</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted md:flex-row">
          <p>&copy; {new Date().getFullYear()} Saarthi AI. Built for citizens.</p>
        </div>
      </div>
    </footer>
  );
}
