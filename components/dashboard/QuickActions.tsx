"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MessageSquareWarning,
  Landmark,
  FileText,
  PhoneCall,
  X,
  Phone,
  AlertOctagon,
  Map,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { getTranslation } from "@/lib/translations";

interface QuickAction {
  icon: any;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
}

const EMERGENCY_CONTACTS = [
  { name: "National Emergency Number", phone: "112", desc: "All-in-one emergency response" },
  { name: "Police", phone: "100", desc: "Immediate police assistance" },
  { name: "Fire", phone: "101", desc: "Fire brigade services" },
  { name: "Ambulance", phone: "102", desc: "Medical emergencies" },
  { name: "Women Helpline", phone: "1091", desc: "Women safety and support" },
  { name: "Disaster Management", phone: "108", desc: "Natural disasters and accidents" },
  { name: "Child Helpline", phone: "1098", desc: "Child protection services" },
];

export default function QuickActions() {
  const [showEmergency, setShowEmergency] = useState(false);
  const { language } = useSettings();
  const t = getTranslation(language).quickActions;

  const ACTIONS: QuickAction[] = [
    {
      icon: Search,
      title: t.findServices,
      description: t.findServicesDesc,
      href: "/dashboard",
    },
    {
      icon: MessageSquareWarning,
      title: t.reportIssue,
      description: t.reportIssueDesc,
      href: "/report",
    },
    {
      icon: Landmark,
      title: t.findSchemes,
      description: t.findSchemesDesc,
      href: "/schemes",
    },
    {
      icon: FileText,
      title: t.docs,
      description: t.docsDesc,
      href: "/documents",
    },
    {
      icon: Map,
      title: t.journey,
      description: t.journeyDesc,
      href: "/journey",
    },
    {
      icon: PhoneCall,
      title: t.emergency,
      description: t.emergencyDesc,
      onClick: () => setShowEmergency(true),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {ACTIONS.map((action, i) => {
          const content = (
            <div className="flex flex-col items-start gap-3 p-5 text-left h-full">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <action.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-ink group-hover:text-primary transition-colors">
                  {action.title}
                </p>
                <p className="mt-0.5 text-xs text-muted leading-snug">{action.description}</p>
              </div>
            </div>
          );

          if (action.href) {
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group surface block transition-shadow hover:shadow-elevated"
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={action.title}
              onClick={action.onClick}
              className="group surface block transition-shadow hover:shadow-elevated"
            >
              {content}
            </button>
          );
        })}
      </div>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergency && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="surface-elevated w-full max-w-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-danger/5">
                <div className="flex items-center gap-2.5">
                  <AlertOctagon className="h-5 w-5 text-danger" />
                  <h3 className="font-display text-base font-semibold text-ink">
                    {t.emergencyTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setShowEmergency(false)}
                  className="rounded-lg p-1.5 hover:bg-background text-muted hover:text-ink"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[60vh] overflow-y-auto p-5">
                <p className="text-xs text-muted mb-4">
                  {t.emergencyDesc2}
                </p>
                <div className="flex flex-col gap-3">
                  {EMERGENCY_CONTACTS.map((contact) => (
                    <a
                      key={contact.phone}
                      href={`tel:${contact.phone}`}
                      className="surface flex items-center justify-between p-3.5 hover:border-danger hover:bg-danger/5 transition-all group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink group-hover:text-danger transition-colors">
                          {contact.name}
                        </p>
                        <p className="text-xs text-muted mt-0.5">{contact.desc}</p>
                      </div>
                      <span className="flex items-center gap-1.5 rounded-lg bg-danger/10 px-3 py-1.5 text-xs font-bold text-danger">
                        <Phone className="h-3.5 w-3.5" />
                        {contact.phone}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border px-5 py-3.5 bg-background flex justify-end">
                <button
                  onClick={() => setShowEmergency(false)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-ink hover:bg-background"
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
