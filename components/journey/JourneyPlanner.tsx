"use client";

import React, { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import JourneyTimeline from './JourneyTimeline';

export default function JourneyPlanner() {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [journeyData, setJourneyData] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsLoading(true);
    setError('');
    setJourneyData(null);

    try {
      const response = await fetch('/api/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goal.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate journey');
      }

      const data = await response.json();
      setJourneyData(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-6">
          <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
          AI Citizen Journey
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Describe what you want to do (e.g., &quot;I want to open a new restaurant&quot; or &quot;How do I renew my driving license?&quot;). 
          Our AI will generate a customized, step-by-step roadmap for you.
        </p>

        <form onSubmit={handleGenerate} className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="E.g., How do I register a new company?"
            className="w-full pl-6 pr-16 py-4 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !goal.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-500 font-medium">{error}</p>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-pulse"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse font-medium">
            Mapping your journey through government services...
          </p>
        </div>
      )}

      {!isLoading && journeyData && (
        <JourneyTimeline data={journeyData} />
      )}
    </div>
  );
}
