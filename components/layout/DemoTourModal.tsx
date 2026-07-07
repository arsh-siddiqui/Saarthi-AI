import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, FileText, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoTourModal({ isOpen, onClose }: DemoTourModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const demoScenarios = [
    {
      title: "Find Passport Office",
      description: "Quickly locate nearby Passport Seva Kendras with AI.",
      icon: MapPin,
      color: "bg-blue-500",
      action: () => {
        onClose();
        router.push("/dashboard?q=passport");
      }
    },
    {
      title: "AI Explains Documents",
      description: "Get personalized document checklists instantly.",
      icon: FileText,
      color: "bg-purple-500",
      action: () => {
        onClose();
        router.push("/documents?q=Passport");
      }
    },
    {
      title: "Report Pothole",
      description: "File an issue with automatic department routing.",
      icon: AlertTriangle,
      color: "bg-danger",
      action: () => {
        onClose();
        router.push("/report?demo=pothole");
      }
    },
    {
      title: "Scheme Recommendation",
      description: "Match citizen profiles to welfare schemes.",
      icon: ShieldCheck,
      color: "bg-success",
      action: () => {
        onClose();
        router.push("/schemes?demo=farmer");
      }
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden border border-border"
          >
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 border-b border-border relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-muted hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <Logo className="w-10 h-10" />
                <h2 className="text-xl font-display font-bold text-ink">Guided Demo Tour</h2>
              </div>
              <p className="text-sm text-muted">
                Experience the best of Saarthi AI in one click. Select a scenario below to auto-start the flow.
              </p>
            </div>

            <div className="p-4 space-y-3">
              {demoScenarios.map((scenario, idx) => (
                <button
                  key={idx}
                  onClick={scenario.action}
                  className="w-full flex items-center p-3 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 ${scenario.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <scenario.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-ink text-sm">{scenario.title}</h3>
                    <p className="text-xs text-muted mt-0.5">{scenario.description}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-muted opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
                </button>
              ))}
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-border text-center">
              <p className="text-[11px] text-muted font-medium uppercase tracking-wider">
                Hackathon Demo Ready
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
