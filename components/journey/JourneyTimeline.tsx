import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface Step {
  id: number;
  title: string;
  description: string;
  estimatedTime?: string;
  department?: string;
  icon?: string;
}

interface JourneyData {
  title: string;
  estimatedTotalTime: string;
  requiredDocuments: string[];
  steps: Step[];
}

export default function JourneyTimeline({ data }: { data: JourneyData | null }) {
  if (!data) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">
          {data.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Estimated Total Time: <span className="text-indigo-600 dark:text-indigo-400">{data.estimatedTotalTime}</span>
        </p>
      </div>

      {data.requiredDocuments && data.requiredDocuments.length > 0 && (
        <div className="mb-10 bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
            <LucideIcons.FileText className="w-5 h-5" />
            Required Documents
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.requiredDocuments.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <LucideIcons.CheckCircle2 className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="relative border-l-2 border-indigo-100 dark:border-gray-800 ml-4 md:ml-8 space-y-8">
        {data.steps.map((step, index) => {
          const IconComponent = (LucideIcons as any)[step.icon || 'CheckCircle'] || LucideIcons.CheckCircle;
          
          return (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              key={step.id} 
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute -left-[17px] top-1 bg-white dark:bg-gray-900 p-1 rounded-full border-2 border-indigo-500">
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h4>
                  {step.estimatedTime && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 whitespace-nowrap">
                      <LucideIcons.Clock className="w-3.5 h-3.5" />
                      {step.estimatedTime}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {step.description}
                </p>
                
                {step.department && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <LucideIcons.Building2 className="w-4 h-4" />
                    <span>{step.department}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
