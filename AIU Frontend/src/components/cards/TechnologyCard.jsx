import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Server, Database, Zap, Cpu, Box, GitBranch, Atom, ExternalLink, ArrowRight } from 'lucide-react';

export function TechnologyCard({ tech }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-5 h-5" />;
      case 'Server': return <Server className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Box': return <Box className="w-5 h-5" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5" />;
      case 'Atom': return <Atom className="w-5 h-5" />;
      default: return <Code2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="group relative flex flex-col p-6 glass-card-hover rounded-2xl">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan border border-cyan-500/20 group-hover:scale-110 transition-transform shadow-glow-cyan">
          {getIcon(tech.icon)}
        </div>
        <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-obsidian-elevated/80 text-typo-secondary border border-obsidian-border">
          {tech.category}
        </span>
      </div>

      <h3 className="text-lg font-bold text-typo-primary group-hover:text-cyan transition-colors">
        <Link to={`/technologies/${tech.slug}`}>{tech.name}</Link>
      </h3>

      <p className="text-xs text-typo-muted mt-2 line-clamp-3 leading-relaxed font-sans">
        {tech.description}
      </p>

      <div className="mt-auto pt-6 border-t border-obsidian-border flex items-center justify-between">
        {tech.website ? (
          <a
            href={tech.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-typo-muted hover:text-cyan transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan" /> Docs
          </a>
        ) : <span />}

        <Link
          to={`/technologies/${tech.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:text-cyan-dark transition-colors group/link"
        >
          <span>Explore Graph</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
