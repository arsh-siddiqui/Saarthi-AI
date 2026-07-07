import React from 'react';
import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface StructuredData {
  summary?: string;
  documents?: string[];
  steps?: string[];
  fees?: string;
  time?: string;
  tips?: string[];
  nearbyOffices?: string;
  nextActions?: string[];
}

export default function StructuredResponse({ data }: { data: StructuredData }) {
  if (!data) return null;

  return (
    <div className="flex flex-col gap-5 text-sm w-full min-w-[250px]">
      {/* Summary */}
      {data.summary && (
        <div>
          <h4 className="flex items-center gap-2 font-bold text-ink mb-2">
            <span>📋</span> Summary
          </h4>
          <hr className="border-border/50 mb-2" />
          <p className="text-muted leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Documents */}
      {data.documents && data.documents.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 font-bold text-ink mb-2">
            <span>📄</span> Required Documents
          </h4>
          <ul className="space-y-1.5 text-muted">
            {data.documents.map((doc: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps */}
      {data.steps && data.steps.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 font-bold text-ink mb-2">
            <span>🛠</span> Steps
          </h4>
          <ol className="list-decimal pl-5 space-y-1 text-muted">
            {data.steps.map((step: string, i: number) => (
              <li key={i} className="pl-1">{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Fees & Time */}
      {(data.fees || data.time) && (
        <div className="grid grid-cols-2 gap-4">
          {data.fees && (
            <div>
              <h4 className="flex items-center gap-2 font-bold text-ink mb-1">
                <span>💰</span> Fees
              </h4>
              <p className="text-muted font-medium ml-6">{data.fees}</p>
            </div>
          )}
          {data.time && (
            <div>
              <h4 className="flex items-center gap-2 font-bold text-ink mb-1">
                <span>⏱</span> Processing Time
              </h4>
              <p className="text-muted font-medium ml-6">{data.time}</p>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      {data.tips && data.tips.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 font-bold text-ink mb-2">
            <span>💡</span> Tips
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-muted">
            {data.tips.map((tip: string, i: number) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Nearby Offices */}
      {data.nearbyOffices && (
        <div>
          <h4 className="flex items-center gap-2 font-bold text-ink mb-2">
            <span>📍</span> Nearby Offices
          </h4>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-background border border-border rounded-lg text-xs font-semibold text-ink hover:border-primary transition-colors shadow-sm ml-6"
          >
            <MapPin className="w-3.5 h-3.5 text-primary" /> Open on Map
          </Link>
        </div>
      )}

      {/* Next Actions */}
      {data.nextActions && data.nextActions.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 font-bold text-ink mb-2">
            <span>➡</span> Next Action
          </h4>
          <div className="flex flex-wrap gap-2 ml-6">
            {data.nextActions.map((action: string, i: number) => {
              const href = action.toLowerCase().includes('report') ? '/report' :
                           action.toLowerCase().includes('scheme') ? '/schemes' : '/dashboard';
              return (
                <Link
                  key={i}
                  href={href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 gradient-brand text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
                >
                  {action}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
