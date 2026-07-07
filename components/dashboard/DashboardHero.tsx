import React from "react";
import Link from "next/link";
import { Search, AlertTriangle, Sparkles, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeroProps {
  onFindServices: () => void;
}

export default function DashboardHero({ onFindServices }: DashboardHeroProps) {
  return (
    <div className="flex h-full flex-col justify-center items-center p-8 bg-gradient-to-br from-background to-primary/5 rounded-2xl border border-border overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
        <Sparkles className="w-64 h-64 text-primary" />
      </div>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-20 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl text-center space-y-6 z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Welcome
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-ink">
          Good Morning <span className="inline-block origin-[70%_70%] animate-[wave_2s_ease-in-out_infinite]">👋</span>
        </h1>
        <p className="text-lg text-muted font-medium">
          How can Saarthi AI help you today?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full">
          <button 
            onClick={onFindServices}
            className="flex items-center gap-3 p-4 rounded-xl surface border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ink text-sm">Find Government Services</h3>
              <p className="text-xs text-muted mt-0.5">Locate offices and centers nearby</p>
            </div>
          </button>

          <Link href="/report" className="flex items-center gap-3 p-4 rounded-xl surface border border-border hover:border-danger/50 hover:bg-danger/5 transition-all text-left group">
            <div className="w-10 h-10 rounded-lg bg-danger text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ink text-sm">Report Public Issue</h3>
              <p className="text-xs text-muted mt-0.5">AI-assisted complaint filing</p>
            </div>
          </Link>

          <Link href="/schemes" className="flex items-center gap-3 p-4 rounded-xl surface border border-border hover:border-success/50 hover:bg-success/5 transition-all text-left group">
            <div className="w-10 h-10 rounded-lg bg-success text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ink text-sm">Find Schemes</h3>
              <p className="text-xs text-muted mt-0.5">Personalized recommendations</p>
            </div>
          </Link>

          <Link href="/documents" className="flex items-center gap-3 p-4 rounded-xl surface border border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-left group">
            <div className="w-10 h-10 rounded-lg bg-purple-500 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ink text-sm">Document Assistant</h3>
              <p className="text-xs text-muted mt-0.5">Checklists and fee guides</p>
            </div>
          </Link>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes wave {
          0% { transform: rotate(0.0deg) }
          10% { transform: rotate(14.0deg) }
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate(0.0deg) }
          100% { transform: rotate(0.0deg) }
        }
      `}</style>
    </div>
  );
}
