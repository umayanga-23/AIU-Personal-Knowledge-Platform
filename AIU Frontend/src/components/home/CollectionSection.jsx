import React, { useState } from 'react';
import { FileText, BookOpen, Layers, Search } from 'lucide-react';
import { ResearchCard } from '../cards/ResearchCard';
import { ArticleCard } from '../cards/ArticleCard';
import { TechnologyCard } from '../cards/TechnologyCard';

export function CollectionSection({ research = [], articles = [], technologies = [] }) {
  const [activeTab, setActiveTab] = useState('research'); // 'research' | 'articles'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResearch = (research || []).filter(r =>
    r.status === 'PUBLISHED' &&
    (r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     r.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
     r.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const filteredArticles = (articles || []).filter(a =>
    a.status === 'PUBLISHED' &&
    (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
     a.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <section id="collection" className="py-20 border-t border-obsidian-border bg-obsidian-secondary/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-cyan uppercase tracking-widest flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan" /> [ KNOWLEDGE COLLECTION ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-typo-primary tracking-tight font-sans">
            Research Papers & Technical Articles
          </h2>
          <p className="text-sm text-typo-secondary max-w-3xl leading-relaxed font-sans">
            Explore academic research publications, algorithm whitepapers, and deep-dive technical articles written by Induwara Umayanga Alukirthi.
          </p>
        </div>

        {/* Tab Selection & Search Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 glass-card rounded-2xl">
          {/* Dual-Part Tab Selector */}
          <div className="flex items-center gap-2 p-1 bg-obsidian-surface/80 rounded-xl border border-obsidian-border font-mono text-xs">
            <button
              onClick={() => setActiveTab('research')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === 'research'
                  ? 'bg-gradient-to-r from-cyan to-indigo text-obsidian-base shadow-glow-cyan'
                  : 'text-typo-muted hover:text-typo-primary hover:bg-obsidian-elevated'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Part 1: Research Papers ({research.filter(r => r.status === 'PUBLISHED').length})</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === 'articles'
                  ? 'bg-gradient-to-r from-cyan to-indigo text-obsidian-base shadow-glow-cyan'
                  : 'text-typo-muted hover:text-typo-primary hover:bg-obsidian-elevated'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Part 2: Technical Articles ({articles.filter(a => a.status === 'PUBLISHED').length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-cyan absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search papers or articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-surface/80 border border-obsidian-border text-xs text-typo-primary focus:outline-none focus:border-cyan transition-all font-mono"
            />
          </div>
        </div>

        {/* Tab 1: Academic Research Papers */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
              <h3 className="text-lg font-bold text-typo-primary flex items-center gap-2 font-sans">
                <FileText className="w-5 h-5 text-cyan" /> Academic Research & Conference Papers
              </h3>
              <span className="text-xs font-mono text-typo-veryMuted">Showing {filteredResearch.length} Papers</span>
            </div>

            {filteredResearch.length === 0 ? (
              <div className="p-12 text-center glass-card rounded-2xl space-y-2">
                <FileText className="w-8 h-8 text-typo-veryMuted mx-auto" />
                <p className="text-sm font-semibold text-typo-secondary">No research papers match your search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredResearch.map(paper => (
                  <ResearchCard key={paper.id} research={paper} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Technical Articles & Tech Matrix */}
        {activeTab === 'articles' && (
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
                <h3 className="text-lg font-bold text-typo-primary flex items-center gap-2 font-sans">
                  <BookOpen className="w-5 h-5 text-emerald-400" /> Technical Articles & Engineering Notes
                </h3>
                <span className="text-xs font-mono text-typo-veryMuted">Showing {filteredArticles.length} Articles</span>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="p-12 text-center glass-card rounded-2xl space-y-2">
                  <BookOpen className="w-8 h-8 text-typo-veryMuted mx-auto" />
                  <p className="text-sm font-semibold text-typo-secondary">No articles match your search query.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>

            {/* Featured Technology Stack */}
            {technologies.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-obsidian-border">
                <h4 className="text-sm font-bold text-typo-primary flex items-center gap-2 font-mono uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-cyan" /> Featured Tech Stack
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {technologies.slice(0, 4).map(tech => (
                    <TechnologyCard key={tech.id} tech={tech} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
