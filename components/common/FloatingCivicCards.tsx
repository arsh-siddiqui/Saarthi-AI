"use client";

import { motion } from "framer-motion";
import { Hospital, ShieldCheck, BookUser, Landmark } from "lucide-react";

const FLOATERS = [
  { icon: Hospital, label: "Hospital", top: "12%", left: "6%", delay: 0 },
  { icon: ShieldCheck, label: "Police", top: "62%", left: "3%", delay: 0.8 },
  { icon: BookUser, label: "Passport", top: "18%", left: "84%", delay: 1.4 },
  { icon: Landmark, label: "Municipal", top: "68%", left: "86%", delay: 0.4 },
];

export default function FloatingCivicCards() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* animated gradient blobs, not glass panels */}
      <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-gradient-shift" />
      <div className="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-gradient-shift" />

      {FLOATERS.map(({ icon: Icon, label, top, left, delay }) => (
        <motion.div
          key={label}
          className="surface absolute hidden items-center gap-2 px-4 py-3 md:flex"
          style={{ top, left }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-ink">{label}</span>
        </motion.div>
      ))}
    </div>
  );
}
