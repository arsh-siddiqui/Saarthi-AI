"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Map,
  MessageSquareWarning,
  FileSearch,
  Languages,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatCard from "@/components/cards/StatCard";
import FeatureCard from "@/components/cards/FeatureCard";
import FloatingCivicCards from "@/components/common/FloatingCivicCards";

const STATS = [
  { value: "200+", label: "Government Services" },
  { value: "24/7", label: "AI Assistance" },
  { value: "100%", label: "Free for Citizens" },
];

const FEATURES = [
  {
    icon: Bot,
    title: "AI Assistant",
    description:
      "Ask questions in plain language and get clear, step-by-step guidance on any government process.",
  },
  {
    icon: Map,
    title: "Smart Maps",
    description:
      "Find the nearest hospitals, police stations, passport offices, and more with live distance and hours.",
  },
  {
    icon: MessageSquareWarning,
    title: "Complaint Reporting",
    description:
      "Report civic issues like broken streetlights or potholes and track resolution in one place.",
  },
  {
    icon: FileSearch,
    title: "Document Guidance",
    description:
      "Understand exactly which documents you need before you visit any office — no repeat trips.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-40 pb-28">
        <FloatingCivicCards />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="surface inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary"
          >
            Saarthi AI
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl md:text-6xl"
          >
            Making Government Services{" "}
            <span className="gradient-text">Simple with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Access government services, report issues, understand documents, and
            receive personalized assistance through one intelligent AI companion. 
            <br/><span className="text-sm font-semibold text-primary/80 mt-2 block">Demo covering major Indian cities.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-xl gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Explore Platform
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard#ai-sidebar"
              className="surface flex items-center gap-2 px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              Talk to AI
            </Link>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} {...stat} delay={0.1 * i} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="platform" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Everything a citizen needs, in one place
          </h2>
          <p className="mt-4 text-muted">
            One platform that replaces a dozen confusing government websites and
            long queues.
          </p>
        </div>

        <div id="services" className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} index={i} {...feature} />
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="gradient-brand flex flex-col items-center gap-6 rounded-3xl px-8 py-14 text-center shadow-glow sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Ready to navigate government services with ease?
            </h3>
            <p className="mt-2 max-w-xl text-white/85">
              Open your dashboard, find nearby offices on the map, and ask the AI
              assistant anything — in seconds.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-elevated transition-transform hover:-translate-y-0.5"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
