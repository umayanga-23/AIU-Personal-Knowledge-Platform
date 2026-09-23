import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { technologyService } from '../../services/technologyService';
import { projectService } from '../../services/projectService';
import { articleService } from '../../services/articleService';
import { researchService } from '../../services/researchService';
import { ArrowLeft, ExternalLink, Code2, BookOpen, FileText, Layers } from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { ArticleCard } from '../../components/cards/ArticleCard';
import { ResearchCard } from '../../components/cards/ResearchCard';

export function TechnologyDetailPage() {
  const { slug } = useParams();
  const [tech, setTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectedData, setConnectedData] = useState({ projects: [], articles: [], research: [] });

  useEffect(() => {
    let active = true;
    const fetchTech = async () => {
      try {
        setLoading(true);
        setError(null);
        let data = await technologyService.getBySlug(slug).catch(() => null);

        // Fallback for tags not in technology table
        if (!data) {
          const formattedName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
          data = {
            id: slug,
            slug: slug,
            name: formattedName,
            category: 'Architecture Tag',
            description: `Showing all portfolio projects, technical articles, and research papers tagged with #${formattedName}.`
          };
        }

        if (!active) return;
        setTech(data);

        const [projects, articles, research] = await Promise.all([
          projectService.getAllPublic().catch(() => []),
          articleService.getAllPublic().catch(() => []),
          researchService.getAllPublic().catch(() => [])
        ]);

        if (active) {
          setConnectedData({
            projects: projects || [],
            articles: articles || [],
            research: research || []
          });
        }
      } catch (err) {
        if (active) setError(err.message || 'Technology not found');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchTech();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <LoadingState message="Loading technology details..." />;
  if (error || !tech) return <ErrorState message={error || 'Technology not found'} />;

  // Find connected entities in graph
  const connectedProjects = connectedData.projects.filter(p => p.technologies?.includes(tech.slug));
  const connectedArticles = connectedData.articles.filter(a => (a.technology === tech.slug || a.tags?.includes(tech.name)));
  const connectedResearch = connectedData.research.filter(r => (r.technologies?.includes(tech.slug) || r.tags?.includes(tech.name)));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back Button */}
      <Link to="/collection" className="inline-flex items-center gap-1.5 text-xs font-mono text-typo-secondary hover:text-cyan transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Knowledge Collection
      </Link>

      {/* Header Banner */}
      <div className="p-8 glass-card rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan border border-cyan-500/20">
            {tech.category}
          </span>
          {tech.website && (
            <a
              href={tech.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-obsidian-elevated hover:bg-obsidian-surface text-xs font-semibold text-cyan transition-colors border border-obsidian-border"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Official Website
            </a>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-typo-primary font-sans">{tech.name}</h1>
        <p className="text-sm text-typo-secondary leading-relaxed max-w-3xl font-sans">{tech.description}</p>
      </div>

      {/* Connected Entities Graph Section */}
      <div className="space-y-12">
        <h2 className="text-xl font-bold text-typo-primary flex items-center gap-2 font-sans">
          <Layers className="w-5 h-5 text-cyan" /> Connected Knowledge Network
        </h2>

        {/* Connected Projects */}
        {connectedProjects.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-cyan uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Projects Utilizing {tech.name} ({connectedProjects.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedProjects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-typo-veryMuted italic">No published projects linked yet.</p>
        )}

        {/* Connected Technical Notes */}
        {connectedArticles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Technical Notes on {tech.name} ({connectedArticles.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedArticles.map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}

        {/* Connected Research */}
        {connectedResearch.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-indigo uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" /> Research Papers Referencing {tech.name} ({connectedResearch.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {connectedResearch.map(r => (
                <ResearchCard key={r.id} research={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
