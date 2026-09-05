import React, { useEffect, useState } from 'react';
import { FileText, BookOpen, Layers, Search, Sparkles } from 'lucide-react';
import { ResearchCard } from '../../components/cards/ResearchCard';
import { ArticleCard } from '../../components/cards/ArticleCard';
import { TechnologyCard } from '../../components/cards/TechnologyCard';
import { LoadingState } from '../../components/common/LoadingState';
import { getStore } from '../../services/apiClient';

export function CollectionPage() {
  const [activeTab, setActiveTab] = useState('research'); // 'research' | 'articles'
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const data = getStore();
    setStore(data);
    setLoading(false);
  }, []);

  if (loading || !store) return <LoadingState message="Loading Collection..." />;

  const filteredResearch = store.research.filter(r =>
    r.status === 'PUBLISHED' &&
    (r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     r.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
     r.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const filteredArticles = store.articles.filter(a =>
    a.status === 'PUBLISHED' &&
    (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
     a.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono text-cyan uppercase tracking-widest flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan" /> [ KNOWLEDGE COLLECTION ]
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-typo-primary tracking-tight font-sans">
          Research & Technical Articles
        </h1>
        <p className="text-base text-typo-secondary leading-relaxed font-sans">
          Explore my academic research publications, conference whitepapers, and technical knowledge base articles on software architecture, systems engineering, and algorithms.
        </p>
      </div>

      {/* Controls Bar: Tab Selector & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 glass-card rounded-2xl">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-1 bg-obsidian-surface/80 rounded-xl border border-obsidian-border font-mono text-xs">
          <button
            onClick={() => setActiveTab('research')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
              activeTab === 'research'
                ? 'bg-gradient-to-r from-cyan to-indigo text-obsidian-base shadow-glow-cyan'
                : 'text-typo-muted hover:text-typo-primary hover:bg-obsidian-elevated'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Part 1: Research Papers ({store.research.filter(r => r.status === 'PUBLISHED').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
              activeTab === 'articles'
                ? 'bg-gradient-to-r from-cyan to-indigo text-obsidian-base shadow-glow-cyan'
                : 'text-typo-muted hover:text-typo-primary hover:bg-obsidian-elevated'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Part 2: Technical Articles ({store.articles.filter(a => a.status === 'PUBLISHED').length})</span>
          </button>
        </div>

        {/* Search Input */}
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

      {/* Part 1: Research Papers View */}
      {activeTab === 'research' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-obsidian-border pb-4">
            <h2 className="text-xl font-bold text-typo-primary flex items-center gap-2 font-sans">
              <FileText className="w-5 h-5 text-cyan" /> Academic Research & Conference Papers
            </h2>
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

      {/* Part 2: Technical Articles & Tech Stack View */}
      {activeTab === 'articles' && (
        <div className="space-y-12">
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-obsidian-border pb-4">
              <h2 className="text-xl font-bold text-typo-primary flex items-center gap-2 font-sans">
                <BookOpen className="w-5 h-5 text-emerald-400" /> Technical Articles & Engineering Notes
              </h2>
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

          {/* Technology Taxonomy Matrix */}
          <div className="space-y-6 pt-6">
            <h2 className="text-xl font-bold text-typo-primary flex items-center gap-2 font-sans border-b border-obsidian-border pb-4">
              <Layers className="w-5 h-5 text-cyan" /> Featured Technology Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {store.technologies.slice(0, 4).map(tech => (
                <TechnologyCard key={tech.id} tech={tech} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
