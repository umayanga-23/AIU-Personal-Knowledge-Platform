import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { getStore } from '../../services/apiClient';
import { ExternalLink, Github, ArrowLeft, CheckCircle2, Layers, FileText, BookOpen, Video, ShieldCheck, Play } from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { ArticleCard } from '../../components/cards/ArticleCard';
import { ResearchCard } from '../../components/cards/ResearchCard';
import { SeoHead } from '../../components/common/SeoHead';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projectService.getBySlug(slug);
        setProject(data);
        setStore(getStore());
      } catch (err) {
        setError(err.message || 'Project not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) return <LoadingState message="Loading project architectural details..." />;
  if (error || !project) return <ErrorState message={error || 'Project not found'} />;

  // Connected entities
  const relatedResearchPapers = store?.research.filter(r => project.relatedResearch?.includes(r.id) && r.status === 'PUBLISHED') || [];
  const relatedKnowledgeArticles = store?.articles.filter(a => project.relatedArticles?.includes(a.id) && a.status === 'PUBLISHED') || [];
  const relatedProjectVideos = store?.videos.filter(v => v.relatedProject === project.id || v.id === project.videoId) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SeoHead
        title={project.title}
        description={project.shortDescription || project.problem}
        image={project.thumbnail}
        type="article"
      />

      {/* Back Link */}
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs font-mono text-typo-secondary hover:text-cyan transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Projects Showcase
      </Link>

      {/* Header & Title */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.technologies?.map(t => (
            <Link key={t} to={`/technologies/${t}`} className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan border border-cyan-500/20 hover:border-cyan/40 transition-all">
              #{t}
            </Link>
          ))}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-typo-primary tracking-tight font-sans">{project.title}</h1>
        <p className="text-base text-typo-secondary leading-relaxed max-w-3xl font-normal">{project.shortDescription}</p>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-4 pt-2 font-mono">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-obsidian-surface hover:bg-obsidian-elevated border border-obsidian-border text-typo-primary font-semibold text-xs rounded-xl transition-all"
            >
              <Github className="w-4 h-4 text-cyan" /> View Source Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan to-indigo hover:from-cyan-dark hover:to-indigo text-obsidian-base font-bold text-xs rounded-xl shadow-glow-cyan transition-all"
            >
              <ExternalLink className="w-4 h-4 text-obsidian-base" /> Launch Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Main Image Screenshot */}
      <div className="relative w-full h-[380px] rounded-3xl overflow-hidden glass-card border border-obsidian-border shadow-2xl bg-obsidian-base">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-base via-transparent to-transparent" />
      </div>

      {/* Embedded Video Demo Section if video available */}
      {relatedProjectVideos.length > 0 && (
        <div className="p-6 glass-card rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-typo-primary flex items-center gap-2 font-sans">
            <Video className="w-5 h-5 text-cyan" /> Video Demonstration & Walkthrough
          </h3>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-obsidian-border shadow-2xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${relatedProjectVideos[0].youtubeId}`}
              title={relatedProjectVideos[0].title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none"
            />
          </div>
        </div>
      )}

      {/* Section: Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 glass-card rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-indigo flex items-center gap-2 uppercase font-mono tracking-wider">
            Problem Statement
          </h3>
          <p className="text-xs sm:text-sm text-typo-secondary leading-relaxed font-sans">{project.problem}</p>
        </div>

        <div className="p-6 glass-card rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-cyan flex items-center gap-2 uppercase font-mono tracking-wider">
            Architecture Solution
          </h3>
          <p className="text-xs sm:text-sm text-typo-secondary leading-relaxed font-sans">{project.solution}</p>
        </div>
      </div>

      {/* Section: Key Features */}
      {project.features && (
        <div className="p-8 glass-card rounded-3xl space-y-5">
          <h3 className="text-lg font-bold text-typo-primary flex items-center gap-2 font-sans">
            <ShieldCheck className="w-5 h-5 text-cyan" /> Key Engineering Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-obsidian-elevated/70 border border-obsidian-border text-xs text-typo-secondary font-sans">
                <CheckCircle2 className="w-4 h-4 text-cyan flex-shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: My Contribution */}
      {project.myContribution && (
        <div className="p-6 glass-card rounded-2xl space-y-2">
          <h3 className="text-xs font-bold text-cyan font-mono uppercase tracking-wider">My Individual Contribution</h3>
          <p className="text-xs sm:text-sm text-typo-secondary leading-relaxed font-sans">{project.myContribution}</p>
        </div>
      )}

      {/* Knowledge Graph Connections: Related Research, Articles, Videos */}
      <div className="space-y-10 pt-8 border-t border-obsidian-border">
        <h2 className="text-xl font-bold text-typo-primary flex items-center gap-2 font-sans">
          <Layers className="w-5 h-5 text-cyan" /> Connected Knowledge Assets
        </h2>

        {/* Related Research */}
        {relatedResearchPapers.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-indigo uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo" /> Related Academic Papers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedResearchPapers.map(paper => (
                <ResearchCard key={paper.id} research={paper} />
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedKnowledgeArticles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" /> Related Technical Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedKnowledgeArticles.map(art => (
                <ArticleCard key={art.id} article={art} />
              ))}
            </div>
          </div>
        )}

        {/* Related Videos */}
        {relatedProjectVideos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-cyan uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan" /> Project Walkthrough Videos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjectVideos.map(vid => (
                <VideoCard key={vid.id} video={vid} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
