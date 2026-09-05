import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { researchService } from '../../services/researchService';
import { getStore } from '../../services/apiClient';
import { ArrowLeft, ExternalLink, Calendar, Users, Code2 } from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { SeoHead } from '../../components/common/SeoHead';

export function ResearchDetailPage() {
  const { slug } = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await researchService.getBySlug(slug).catch(() => null);
        const storeData = getStore();
        const finalPaper = data || storeData?.research.find(r => r.slug === slug || r.id === slug);
        setPaper(finalPaper);
        setStore(storeData);
      } catch (err) {
        const storeData = getStore();
        const fallback = storeData?.research.find(r => r.slug === slug || r.id === slug);
        if (fallback) {
          setPaper(fallback);
          setStore(storeData);
        } else {
          setError(err.message || 'Research paper not found');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [slug]);

  if (loading) return <LoadingState message="Loading publication details..." />;
  if (error || !paper) return <ErrorState message={error || 'Research paper not found'} />;

  const relatedProjectsList = store?.projects.filter(p => paper.relatedProjects?.includes(p.id) && p.status === 'PUBLISHED') || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SeoHead
        title={paper.title}
        description={paper.abstract}
        type="article"
      />

      {/* Back Button */}
      <Link to="/collection" className="inline-flex items-center gap-1.5 text-xs font-mono text-typo-secondary hover:text-cyan transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Knowledge Collection
      </Link>

      {/* Header Metadata */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {paper.tags?.map(t => (
            <span key={t} className="px-2.5 py-1 rounded-md text-xs font-mono bg-obsidian-elevated text-typo-secondary border border-obsidian-border">
              #{t}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-typo-primary font-sans">{paper.title}</h1>

        <div className="flex flex-wrap items-center gap-6 text-xs text-typo-secondary font-mono pt-2 border-t border-b border-obsidian-border py-3">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-cyan" /> {paper.publishDate}</span>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-cyan" /> {paper.authors?.join(', ')}</span>
        </div>

        {paper.publicationInfo && (
          <p className="text-sm font-medium text-cyan italic font-mono">
            Published in: {paper.publicationInfo}
          </p>
        )}

        {paper.documentUrl && (
          <div className="pt-2">
            <a
              href={paper.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan to-indigo text-obsidian-base font-bold text-xs rounded-xl shadow-glow-cyan transition-all"
            >
              <ExternalLink className="w-4 h-4 text-obsidian-base" /> Access PDF Document / IEEE Explorer
            </a>
          </div>
        )}
      </div>

      {/* Paper Sections */}
      <div className="space-y-8 text-sm text-typo-secondary leading-relaxed font-sans">
        {/* Abstract Box */}
        <div className="p-6 glass-card rounded-2xl space-y-2">
          <h3 className="font-mono text-xs text-cyan font-bold uppercase tracking-wider">Abstract</h3>
          <p className="italic text-typo-primary">{paper.abstract}</p>
        </div>

        {paper.introduction && (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-typo-primary border-b border-obsidian-border pb-2">1. Introduction</h3>
            <p>{paper.introduction}</p>
          </div>
        )}

        {paper.methodology && (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-typo-primary border-b border-obsidian-border pb-2">2. Methodology & Architecture</h3>
            <p>{paper.methodology}</p>
          </div>
        )}

        {paper.results && (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-typo-primary border-b border-obsidian-border pb-2">3. Empirical Benchmarks & Results</h3>
            <p>{paper.results}</p>
          </div>
        )}

        {paper.conclusion && (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-typo-primary border-b border-obsidian-border pb-2">4. Conclusion & Future Scope</h3>
            <p>{paper.conclusion}</p>
          </div>
        )}
      </div>

      {/* Connected Projects */}
      {relatedProjectsList.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-obsidian-border">
          <h3 className="text-xl font-bold text-typo-primary flex items-center gap-2 font-sans">
            <Code2 className="w-5 h-5 text-cyan" /> Implementations & Connected Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedProjectsList.map(proj => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
