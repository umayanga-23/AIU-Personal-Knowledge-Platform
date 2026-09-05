import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Users, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export function ResearchCard({ research, showStatus = false }) {
  return (
    <div className="group relative flex flex-col p-6 glass-card-hover rounded-2xl">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan border border-cyan-500/20 group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4" />
          </span>
          {research.featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-indigo-500/20 text-indigo border border-indigo-500/30">
              <Sparkles className="w-3 h-3 text-indigo" /> Featured Paper
            </span>
          )}
        </div>
        {showStatus && <StatusBadge status={research.status} />}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-typo-primary group-hover:text-cyan transition-colors line-clamp-2">
        <Link to={`/research/${research.slug}`}>{research.title}</Link>
      </h3>

      <p className="text-xs text-typo-muted mt-2.5 line-clamp-3 leading-relaxed font-sans">
        {research.abstract}
      </p>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-typo-secondary mt-4 font-mono">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan" /> {research.publishDate}
        </span>
        {research.authors && (
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo" /> {research.authors.join(', ')}
          </span>
        )}
      </div>

      {/* Publication Info & Tags */}
      {research.publicationInfo && (
        <p className="text-[11px] font-medium text-cyan/90 mt-2 italic font-mono">
          Published in: {research.publicationInfo}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mt-4">
        {research.tags?.map((tag) => (
          <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-obsidian-elevated/80 text-typo-secondary border border-obsidian-border">
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-auto pt-4 border-t border-obsidian-border flex items-center justify-between">
        {research.documentUrl ? (
          <a
            href={research.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-typo-muted hover:text-cyan transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan" /> PDF / Paper
          </a>
        ) : <span />}

        <Link
          to={`/research/${research.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:text-cyan-dark transition-colors group/link"
        >
          <span>Read Paper</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
