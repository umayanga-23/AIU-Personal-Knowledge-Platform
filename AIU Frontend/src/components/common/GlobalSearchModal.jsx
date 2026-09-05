import React, { useState, useEffect } from 'react';
import { Search, Code2, BookOpen, Layers, Video, FileText, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStore } from '../../services/apiClient';

export function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], research: [], articles: [], technologies: [], videos: [] });
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], research: [], articles: [], technologies: [], videos: [] });
      return;
    }

    const q = query.toLowerCase();
    const store = getStore();

    const matchedProjects = store.projects.filter(p => 
      p.status === 'PUBLISHED' && (p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedResearch = store.research.filter(r => 
      r.status === 'PUBLISHED' && (r.title.toLowerCase().includes(q) || r.abstract.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedArticles = store.articles.filter(a => 
      a.status === 'PUBLISHED' && (a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedTechnologies = store.technologies.filter(t => 
      t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedVideos = store.videos.filter(v => 
      v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
    ).slice(0, 3);

    setResults({
      projects: matchedProjects,
      research: matchedResearch,
      articles: matchedArticles,
      technologies: matchedTechnologies,
      videos: matchedVideos
    });
  }, [query]);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  const totalResults = results.projects.length + results.research.length + results.articles.length + results.technologies.length + results.videos.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-950">
          <Search className="w-5 h-5 text-teal-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, research, technical notes, technologies..."
            className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none text-base font-medium"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {!query.trim() && (
            <div className="text-center py-8 text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p className="text-xs font-mono">Type any technology (Spring Boot, React, PostgreSQL), research topic, or project name...</p>
            </div>
          )}

          {query.trim() && totalResults === 0 && (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm">No knowledge assets found matching "{query}".</p>
            </div>
          )}

          {/* Projects Group */}
          {results.projects.length > 0 && (
            <div>
              <h5 className="text-xs font-mono text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> Projects ({results.projects.length})
              </h5>
              <div className="space-y-1.5">
                {results.projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(`/projects/${p.slug}`)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h6 className="text-sm font-semibold text-slate-200 group-hover:text-teal-400">{p.title}</h6>
                      <p className="text-xs text-slate-400 line-clamp-1">{p.shortDescription}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Research Group */}
          {results.research.length > 0 && (
            <div>
              <h5 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Research Papers ({results.research.length})
              </h5>
              <div className="space-y-1.5">
                {results.research.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect(`/research/${r.slug}`)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h6 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400">{r.title}</h6>
                      <p className="text-xs text-slate-400 line-clamp-1">{r.abstract}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Articles Group */}
          {results.articles.length > 0 && (
            <div>
              <h5 className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Technical Notes ({results.articles.length})
              </h5>
              <div className="space-y-1.5">
                {results.articles.map(a => (
                  <button
                    key={a.id}
                    onClick={() => handleSelect(`/knowledge/${a.slug}`)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h6 className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">{a.title}</h6>
                      <p className="text-xs text-slate-400 line-clamp-1">{a.excerpt}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Technologies Group */}
          {results.technologies.length > 0 && (
            <div>
              <h5 className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Technologies ({results.technologies.length})
              </h5>
              <div className="space-y-1.5">
                {results.technologies.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect(`/technologies/${t.slug}`)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h6 className="text-sm font-semibold text-slate-200 group-hover:text-purple-400">{t.name} ({t.category})</h6>
                      <p className="text-xs text-slate-400 line-clamp-1">{t.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Videos Group */}
          {results.videos.length > 0 && (
            <div>
              <h5 className="text-xs font-mono text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> Videos ({results.videos.length})
              </h5>
              <div className="space-y-1.5">
                {results.videos.map(v => (
                  <button
                    key={v.id}
                    onClick={() => handleSelect(`/videos`)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h6 className="text-sm font-semibold text-slate-200 group-hover:text-rose-400">{v.title}</h6>
                      <p className="text-xs text-slate-400 line-clamp-1">{v.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
