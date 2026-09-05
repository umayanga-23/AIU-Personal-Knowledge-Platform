import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Layers } from 'lucide-react';
import { ArticleCard } from '../cards/ArticleCard';
import { TechnologyCard } from '../cards/TechnologyCard';

export function ArticlesSection({ articles, technologies }) {
  const publishedArticles = articles ? articles.filter(a => a.status === 'PUBLISHED') : [];
  const featuredTech = technologies ? technologies.slice(0, 4) : [];

  return (
    <section id="articles" className="py-20 border-t border-obsidian-border bg-obsidian-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10 font-sans">
        {/* Technical Articles Header */}
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-obsidian-border pb-5">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-emerald-400" /> [ KNOWLEDGE BASE & TUTORIALS ]
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-typo-primary tracking-tight font-sans">
                Technical Articles & Engineering Notes
              </h2>
              <p className="text-xs sm:text-sm text-typo-secondary max-w-2xl mt-1 leading-relaxed">
                In-depth articles, software architecture tutorials, and code guides by Induwara Umayanga Alukirthi.
              </p>
            </div>
            <Link to="/knowledge" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 font-mono transition-colors shrink-0">
              <span>View All Articles ({publishedArticles.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedArticles.slice(0, 3).map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Featured Technology Stack Matrix */}
        {featuredTech.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-obsidian-border/60">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-typo-primary flex items-center gap-2 font-sans">
                <Layers className="w-5 h-5 text-cyan" /> Featured Technology Stack
              </h3>
              <Link to="/technologies" className="text-xs font-mono text-cyan hover:underline flex items-center gap-1">
                Explore Tech Matrix <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTech.map(tech => (
                <TechnologyCard key={tech.id} tech={tech} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
