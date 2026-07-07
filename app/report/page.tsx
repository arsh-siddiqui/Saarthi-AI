"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  X,
  FileText,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function ReportPage() {
  const { language } = useSettings();
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [complaintText, setComplaintText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Editable generated state
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    department: string;
    priority: "Low" | "Medium" | "High";
    category: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert("Please upload an image file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerate = async () => {
    if (!complaintText.trim() && !image) {
      setError("Please describe the issue or upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setFormData(null);

    try {
      let imageBase64 = "";
      if (image) {
        imageBase64 = await fileToBase64(image);
      }

      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: complaintText,
          image: imageBase64 || null,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze complaint.");
      }

      setFormData({
        title: data.title || "",
        description: data.description || "",
        department: data.department || "",
        priority: data.priority || "Medium",
        category: data.category || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating complaint details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            <h1 className="font-display text-2xl font-bold tracking-tight">AI Issue Reporter</h1>
            <p className="text-xs text-muted">Generate formal government-ready civic complaints</p>
          </div>
        </div>

        {submitted ? (
          <div className="surface p-8 text-center space-y-5 max-w-xl mx-auto mt-10">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle className="h-10 w-10" />
            </span>
            <div className="space-y-2">
              <h2 className="font-display text-xl font-semibold text-ink">Complaint Filed Successfully!</h2>
              <p className="text-sm text-muted">
                Your complaint has been formatted and submitted. It is now queued for municipal department dispatch.
              </p>
            </div>
            <div className="p-4 bg-background rounded-xl border border-border text-left space-y-2 text-xs">
              <p className="font-bold text-ink">Submitted Details:</p>
              <p><span className="text-muted">Title:</span> {formData?.title}</p>
              <p><span className="text-muted">Department:</span> {formData?.department}</p>
              <p><span className="text-muted">Priority:</span> {formData?.priority}</p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData(null);
                  setImage(null);
                  setImagePreview(null);
                  setComplaintText("");
                }}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-ink hover:bg-background"
              >
                File Another Issue
              </button>
              <Link
                href="/dashboard"
                className="rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-white"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Column */}
            <div className="space-y-5">
              <div className="surface p-5 space-y-4">
                <h3 className="font-display text-base font-semibold text-ink">Step 1: Upload or Describe</h3>

                {/* Drag-and-drop Image Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : imagePreview
                      ? "border-border bg-background"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative w-full max-w-[200px] group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="rounded-xl object-cover max-h-36 mx-auto shadow-soft"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute -top-2 -right-2 bg-ink text-white rounded-full p-1 hover:bg-danger transition-colors shadow-elevated"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                        <Upload className="h-5 w-5" />
                      </span>
                      <p className="text-xs font-semibold text-ink">Drag & drop photo or click to browse</p>
                      <p className="text-[10px] text-muted mt-1">Upload pothole, broken streetlight, waste dump, etc.</p>
                    </>
                  )}
                </div>

                {/* Complaint Text Area */}
                <div className="space-y-2">
                  <label htmlFor="complaint-desc" className="text-xs font-bold text-ink">Describe the Issue (Optional if photo provided)</label>
                  <textarea
                    id="complaint-desc"
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    placeholder="Provide description of the issue. E.g., 'Large pothole on linking road opposite national bank causing traffic blocks...'"
                    rows={4}
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading || (!complaintText.trim() && !image)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl gradient-brand py-3 text-xs font-bold text-white disabled:opacity-40 shadow-glow"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing issue & generating...
                    </>
                  ) : (
                    "Generate AI Complaint"
                  )}
                </button>
              </div>

              {error && (
                <div className="surface border-danger/30 bg-danger/5 p-4 flex gap-3 text-xs text-danger rounded-2xl">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Generated & Edit Column */}
            <div className="space-y-5">
              {loading ? (
                <div className="surface p-5 h-full flex flex-col items-center justify-center min-h-[300px] text-muted space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="text-center">
                    <p className="text-xs font-bold text-ink">AI Civic Assistant is processing</p>
                    <p className="text-[10px] text-muted mt-1">Classifying issue, identifying department & priority...</p>
                  </div>
                </div>
              ) : formData ? (
                <form onSubmit={handleSubmit} className="surface p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
                      <FileText className="h-4.5 w-4.5 text-primary" /> Step 2: Edit & Review
                    </h3>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label htmlFor="comp-title" className="text-[10px] font-bold text-muted uppercase">Complaint Title</label>
                    <input
                      id="comp-title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label htmlFor="comp-desc" className="text-[10px] font-bold text-muted uppercase">Detailed Description</label>
                    <textarea
                      id="comp-desc"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={5}
                      className="w-full rounded-lg border border-border bg-background p-3 text-xs text-ink focus:border-primary focus:outline-none resize-none leading-relaxed"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Priority */}
                    <div className="space-y-1.5">
                      <label htmlFor="comp-priority" className="text-[10px] font-bold text-muted uppercase">Priority</label>
                      <select
                        id="comp-priority"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as "Low" | "Medium" | "High" })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label htmlFor="comp-category" className="text-[10px] font-bold text-muted uppercase">Category</label>
                      <input
                        id="comp-category"
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5">
                    <label htmlFor="comp-dept" className="text-[10px] font-bold text-muted uppercase">Responsible Department</label>
                    <input
                      id="comp-dept"
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl gradient-brand py-3 text-xs font-bold text-white shadow-glow hover:opacity-95 transition-opacity mt-4"
                  >
                    Submit Complaint
                  </button>
                </form>
              ) : (
                <div className="surface p-5 h-full flex flex-col items-center justify-center min-h-[300px] text-muted border-2 border-dashed border-border">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-border text-muted mb-3">
                    <FileText className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-bold text-ink">Review Area</p>
                  <p className="text-[10px] text-muted text-center max-w-[240px] mt-1">
                    Your generated formal report will appear here. You can refine and edit the wording before submitting.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Simple loader helper
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
