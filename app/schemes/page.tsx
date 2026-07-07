"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Landmark,
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  IndianRupee,
  FileCheck,
  HelpCircle,
  Award,
  Sparkles,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface Scheme {
  name: string;
  whyEligible: string;
  benefits: string;
  documentsRequired: string[];
  applySteps: string[];
}

export default function SchemesPage() {
  const { language } = useSettings();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schemes, setSchemes] = useState<Scheme[] | null>(null);

  // Form Fields
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [state, setState] = useState("");
  const [income, setIncome] = useState("");
  const [occupation, setOccupation] = useState("");
  const [isStudent, setIsStudent] = useState(false);

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleRecommend = async () => {
    if (!age || !state || !occupation || !income) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSchemes(null);

    try {
      const res = await fetch("/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(age),
          state,
          occupation,
          student: isStudent,
          income: Number(income),
          gender: gender || null,
          language,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to load scheme recommendations.");
      }

      setSchemes(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error querying welfare schemes.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSchemes(null);
    setAge("");
    setGender("");
    setState("");
    setIncome("");
    setOccupation("");
    setIsStudent(false);
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="text-right">
            <h1 className="font-display text-2xl font-bold tracking-tight">Scheme Recommender</h1>
            <p className="text-xs text-muted">Find matching state & central government welfare schemes</p>
          </div>
        </div>

        {schemes ? (
          /* Results View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">Recommended Welfare Schemes</h2>
              <button
                onClick={handleReset}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-ink hover:bg-background"
              >
                Search Again
              </button>
            </div>

            {schemes.length === 0 ? (
              <div className="surface p-8 text-center text-muted rounded-2xl flex flex-col items-center justify-center gap-3">
                <HelpCircle className="h-8 w-8 text-muted/50" />
                <p>No matching schemes found for this profile. Try adjusting your details.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
              {schemes.map((scheme, idx) => (
                <div key={idx} className="surface p-5 space-y-4 relative group">
                  <div className="flex items-start justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Award className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-semibold text-ink">{scheme.name}</h3>
                        <span className="inline-block rounded-full bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 mt-1">
                          Eligible Profile Match
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    {/* Eligibility & Benefits */}
                    <div className="space-y-3.5">
                      <div>
                        <h4 className="font-bold text-muted uppercase text-[10px] tracking-wider">Why You Are Eligible</h4>
                        <p className="text-ink mt-1 leading-relaxed bg-background p-3 rounded-lg border border-border">{scheme.whyEligible}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-muted uppercase text-[10px] tracking-wider">Benefits</h4>
                        <p className="text-ink mt-1 leading-relaxed bg-background p-3 rounded-lg border border-border">{scheme.benefits}</p>
                      </div>
                    </div>

                    {/* Docs & Steps */}
                    <div className="space-y-3.5">
                      <div>
                        <h4 className="font-bold text-muted uppercase text-[10px] tracking-wider flex items-center gap-1">
                          <FileCheck className="h-3.5 w-3.5" /> Documents Required
                        </h4>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {scheme.documentsRequired.map((doc, dIdx) => (
                            <span key={dIdx} className="rounded bg-border/50 border border-border px-2.5 py-1 text-[11px] text-ink font-medium">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-muted uppercase text-[10px] tracking-wider flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-primary" /> Application Steps
                        </h4>
                        <ol className="list-decimal pl-4 space-y-1.5 text-ink leading-relaxed mt-1">
                          {scheme.applySteps.map((stepStr, sIdx) => (
                            <li key={sIdx}>{stepStr}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        ) : (
          /* Multi-step Form View */
          <div className="surface max-w-xl mx-auto p-6 space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="font-display text-base font-bold text-ink">Find Welfare Schemes</h2>
                <p className="text-[11px] text-muted">Fill in details to search central and state policies</p>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                Step {step} of 3
              </span>
            </div>

            {/* Steps Container */}
            <div className="min-h-[160px] flex flex-col justify-center">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="scheme-age" className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted" /> Age (Years) *
                      </label>
                      <input
                        id="scheme-age"
                        type="number"
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="E.g., 28"
                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="scheme-gender" className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted" /> Gender (Optional)
                      </label>
                      <select
                        id="scheme-gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="scheme-state" className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted" /> State of Residence *
                      </label>
                      <select
                        id="scheme-state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                        required
                      >
                        <option value="">Select State</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Telangana">Telangana</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="scheme-income" className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <IndianRupee className="h-3.5 w-3.5 text-muted" /> Annual Income (INR) *
                      </label>
                      <input
                        id="scheme-income"
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        placeholder="E.g., 250000"
                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="scheme-job" className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-muted" /> Occupation *
                    </label>
                    <input
                      id="scheme-job"
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="E.g., Farmer, Business Owner, Unemployed"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5">
                    <input
                      id="scheme-student"
                      type="checkbox"
                      checked={isStudent}
                      onChange={(e) => setIsStudent(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="scheme-student" className="text-xs font-semibold text-ink flex items-center gap-1.5 cursor-pointer select-none">
                      <GraduationCap className="h-4 w-4 text-primary" /> Are you currently a student?
                    </label>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="border-danger/30 bg-danger/5 p-4 flex gap-3 text-xs text-danger rounded-xl">
                <HelpCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between border-t border-border pt-4 bg-background">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1 || loading}
                className="flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-ink hover:bg-background disabled:opacity-30"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Previous
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 rounded-xl gradient-brand px-5 py-2.5 text-xs font-bold text-white shadow-soft"
                >
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRecommend}
                  disabled={loading || !age || !state || !occupation || !income}
                  className="flex items-center gap-1.5 rounded-xl gradient-brand px-5 py-2.5 text-xs font-bold text-white disabled:opacity-40 shadow-glow"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Matching...
                    </>
                  ) : (
                    "Find Match"
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Loader icon helper
function Loader2({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
