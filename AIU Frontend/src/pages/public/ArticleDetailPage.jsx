import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { getStore } from '../../services/apiClient';
import { ArrowLeft, Clock, Calendar, Layers, Code2, FileText, ExternalLink } from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { ResearchCard } from '../../components/cards/ResearchCard';
import { SeoHead } from '../../components/common/SeoHead';

export function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await articleService.getBySlug(slug).catch(() => null);
        const storeData = getStore();
        const finalArticle = data || storeData?.articles.find(a => a.slug === slug || a.id === slug);
        setArticle(finalArticle);
        setStore(storeData);
      } catch (err) {
        const storeData = getStore();
        const fallback = storeData?.articles.find(a => a.slug === slug || a.id === slug);
        if (fallback) {
          setArticle(fallback);
          setStore(storeData);
        } else {
          setError(err.message || 'Technical article not found');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <LoadingState message="Loading technical article..." />;
  if (error || !article) return <ErrorState message={error || 'Technical article not found'} />;

  const relatedProjectsList = store?.projects.filter(p => article.relatedProjects?.includes(p.id) && p.status === 'PUBLISHED') || [];
  const relatedResearchList = store?.research.filter(r => article.relatedResearch?.includes(r.id) && r.status === 'PUBLISHED') || [];
  const pdfUrl = article.documentUrl || article.pdfUrl;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      <SeoHead
        title={article.title}
        description={article.excerpt}
        image={article.coverImage}
        type="article"
      />

      {/* Back Button */}
      <Link to="/collection" className="inline-flex items-center gap-1.5 text-xs font-mono text-typo-secondary hover:text-cyan transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Knowledge Collection
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {article.technology && (
            <Link to={`/technologies/${article.technology}`} className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan border border-cyan-500/20">
              #{article.technology}
            </Link>
          )}
          {article.tags?.map(t => (
            <span key={t} className="px-2.5 py-1 rounded-md text-xs font-mono bg-obsidian-elevated text-typo-secondary border border-obsidian-border">
              {t}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-typo-primary font-sans leading-tight">{article.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-typo-secondary pt-2 border-t border-b border-obsidian-border py-3">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-cyan" /> {article.publishDate}</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-cyan" /> {article.readingTime || '5 min read'}</span>
        </div>

        {/* PDF Link Button */}
        {pdfUrl && (
          <div className="pt-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan to-indigo text-obsidian-base font-bold text-xs rounded-xl shadow-glow-cyan transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4 text-obsidian-base" />
              <span>Read Full Article PDF / Document</span>
              <ExternalLink className="w-4 h-4 text-obsidian-base" />
            </a>
          </div>
        )}
      </div>

      {/* Cover Banner */}
      {article.coverImage && (
        <div className="relative w-full h-[350px] rounded-3xl overflow-hidden border border-obsidian-border shadow-2xl bg-obsidian-base">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-base via-transparent to-transparent"></div>
        </div>
      )}

      {/* Summary Box */}
      <div className="space-y-6 text-sm text-typo-secondary leading-relaxed font-sans">
        <div className="p-6 glass-card rounded-2xl border border-cyan/30 space-y-2">
          <h3 className="font-mono text-xs text-cyan font-bold uppercase tracking-wider">Article Summary</h3>
          <p className="text-sm text-typo-primary font-medium leading-relaxed italic">{article.excerpt}</p>
        </div>

        {article.content && (
          <div className="space-y-4 whitespace-pre-line font-sans leading-relaxed text-typo-secondary">
            {article.content}
          </div>
        )}
      </div>

      {/* Connected Knowledge Entities */}
      {(relatedProjectsList.length > 0 || relatedResearchList.length > 0) && (
        <div className="space-y-8 pt-8 border-t border-obsidian-border">
          <h3 className="text-xl font-bold text-typo-primary flex items-center gap-2 font-sans">
            <Layers className="w-5 h-5 text-cyan" /> Connected Knowledge Graph
          </h3>

          {relatedProjectsList.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono text-cyan uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Related Projects
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedProjectsList.map(p => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          )}

          {relatedResearchList.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono text-indigo uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> Related Academic Papers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedResearchList.map(r => (
                  <ResearchCard key={r.id} research={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
