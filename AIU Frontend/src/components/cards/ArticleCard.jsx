import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export function ArticleCard({ article, showStatus = false }) {
  return (
    <div className="group relative flex flex-col glass-card-hover rounded-2xl overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-44 w-full overflow-hidden bg-obsidian-base">
        <img
          src={article.coverImage || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-surface via-obsidian-surface/30 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          {article.technology && (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-cyan text-slate-950 shadow-glow-cyan">
              #{article.technology}
            </span>
          )}
          {showStatus && <StatusBadge status={article.status} />}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-6 space-y-3">
        <div className="flex items-center gap-3 text-xs text-typo-secondary font-mono">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan" /> {article.publishDate}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan" /> {article.readingTime || '5 min read'}
          </span>
        </div>

        <h3 className="text-base font-bold text-typo-primary group-hover:text-cyan transition-colors line-clamp-2">
          <Link to={`/knowledge/${article.slug}`}>{article.title}</Link>
        </h3>

        <p className="text-xs text-typo-muted line-clamp-2 leading-relaxed font-sans">
          {article.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {article.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono bg-obsidian-elevated/80 text-typo-secondary border border-obsidian-border">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-auto pt-4 border-t border-obsidian-border flex items-center justify-between">
          <span className="text-xs text-typo-veryMuted font-mono flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan" /> Technical Note
          </span>
          <Link
            to={`/knowledge/${article.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:text-cyan-dark transition-colors group/link"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
