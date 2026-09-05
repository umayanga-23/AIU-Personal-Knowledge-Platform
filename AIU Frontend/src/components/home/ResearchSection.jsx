import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { ResearchCard } from '../cards/ResearchCard';

export function ResearchSection({ research }) {
  const publishedResearch = research ? research.filter(r => r.status === 'PUBLISHED') : [];

  return (
    <section id="research" className="py-20 border-t border-obsidian-border bg-obsidian-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-obsidian-border pb-5">
          <div>
            <span className="text-xs font-mono text-cyan uppercase tracking-widest flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-cyan" /> [ ACADEMIC PUBLICATIONS ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-typo-primary tracking-tight font-sans">
              Research Papers & Whitepapers
            </h2>
            <p className="text-xs sm:text-sm text-typo-secondary max-w-2xl mt-1 leading-relaxed">
              Academic conference papers, distributed algorithms, and vector search whitepapers by Induwara Umayanga Alukirthi.
            </p>
          </div>
          <Link to="/research" className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:text-cyan-dark font-mono transition-colors shrink-0">
            <span>View All Papers ({publishedResearch.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Research Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publishedResearch.slice(0, 4).map(paper => (
            <ResearchCard key={paper.id} research={paper} />
          ))}
        </div>
      </div>
    </section>
  );
}
