import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Youtube, Sparkles, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export function ProjectCard({ project, showStatus = false }) {
  return (
    <div className="group relative flex flex-col glass-card-hover rounded-2xl overflow-hidden">
      {/* Thumbnail Container */}
      <div className="relative h-48 w-full overflow-hidden bg-obsidian-base">
        <img
          src={project.thumbnail || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-surface via-obsidian-surface/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {project.featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-cyan text-slate-950 shadow-glow-cyan">
              <Sparkles className="w-3 h-3 text-slate-950" /> Featured
            </span>
          )}
          {showStatus && <StatusBadge status={project.status} />}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-typo-primary group-hover:text-cyan transition-colors line-clamp-1">
            <Link to={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>
          <p className="text-xs text-typo-muted mt-2 line-clamp-2 leading-relaxed font-sans">
            {project.shortDescription}
          </p>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.technologies?.slice(0, 4).map((techSlug) => (
            <Link
              key={techSlug}
              to={`/technologies/${techSlug}`}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-obsidian-elevated/80 text-typo-secondary border border-obsidian-border hover:border-cyan/40 hover:text-cyan transition-all"
            >
              #{techSlug}
            </Link>
          ))}
          {project.technologies?.length > 4 && (
            <span className="px-2 py-1 rounded-lg text-[11px] font-mono bg-obsidian-elevated/50 text-typo-veryMuted">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Actions Footer */}
        <div className="mt-auto pt-4 border-t border-obsidian-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-typo-muted hover:text-typo-primary transition-colors"
                title="View Source Code on GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-typo-muted hover:text-cyan transition-colors"
                title="View Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.videoId && (
              <Link
                to="/videos"
                className="text-typo-muted hover:text-indigo transition-colors"
                title="Watch Walkthrough Video"
              >
                <Youtube className="w-4 h-4" />
              </Link>
            )}
          </div>

          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:text-cyan-dark transition-colors group/link"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
