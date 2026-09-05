import React from 'react';
import { Milestone } from 'lucide-react';
import { Timeline } from '../journey/Timeline';

export function JourneySection({ journey }) {
  return (
    <section id="journey" className="py-20 border-t border-obsidian-border bg-obsidian-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10 font-sans">
        {/* Header */}
        <div>
          <span className="text-xs font-mono text-cyan uppercase tracking-widest flex items-center gap-2 mb-2">
            <Milestone className="w-4 h-4 text-cyan" /> [ GROWTH TIMELINE ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-typo-primary tracking-tight">
            Learning Journey & Growth
          </h2>
          <p className="text-sm text-typo-secondary max-w-2xl mt-2 leading-relaxed font-sans">
            Chronological growth milestones tracking software engineering concepts learned, architectural patterns mastered, and systems built by Induwara Umayanga Alukirthi.
          </p>
        </div>

        {/* Timeline Component */}
        <div className="max-w-4xl">
          <Timeline journey={journey} />
        </div>
      </div>
    </section>
  );
}
