import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Github, Linkedin, Youtube, Twitter } from 'lucide-react';
import { getStore } from '../../services/apiClient';

export function Footer() {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const syncFooter = () => {
      const store = getStore();
      setFooterData({
        ...store.profile,
        ...(store.footer || {})
      });
    };

    syncFooter();

    window.addEventListener('aiu_store_updated', syncFooter);
    window.addEventListener('storage', syncFooter);
    return () => {
      window.removeEventListener('aiu_store_updated', syncFooter);
      window.removeEventListener('storage', syncFooter);
    };
  }, []);

  const brandName = footerData?.brandName || footerData?.name || "Induwara Umayanga Alukirthi";
  const tagline = footerData?.tagline || "Personal knowledge platform, research showcase, technical notes, and system engineering profile.";
  const statusText = footerData?.statusText || "All systems operational";
  const statusType = footerData?.statusType || "OPERATIONAL";
  const copyrightText = footerData?.copyrightText || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`;

  const getStatusPillClass = () => {
    if (statusType === 'OUTAGE') return 'bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-glow-rose';
    if (statusType === 'DEGRADED') return 'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-glow-amber';
    return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-glow-emerald';
  };

  const getDotClass = () => {
    if (statusType === 'OUTAGE') return 'bg-rose-400 animate-ping';
    if (statusType === 'DEGRADED') return 'bg-amber-400 animate-pulse';
    return 'bg-emerald-400 animate-pulse';
  };

  return (
    <footer className="mt-20 border-t border-obsidian-border bg-obsidian-secondary/80 backdrop-blur-xl text-typo-muted text-xs py-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3.5 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan border border-cyan-500/20 group-hover:scale-105 transition-transform shadow-glow-cyan">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-bold text-typo-primary text-sm tracking-tight group-hover:text-cyan transition-colors">{brandName}</span>
            </Link>
            <p className="text-typo-veryMuted leading-relaxed text-xs">
              {tagline}
            </p>

            {/* Dynamic System Operational Status Pill */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono transition-all ${getStatusPillClass()}`}>
              <span className={`w-2 h-2 rounded-full ${getDotClass()}`} />
              <span>{statusText}</span>
            </div>
          </div>

          {/* Platform Indices */}
          <div>
            <h4 className="font-mono text-typo-secondary uppercase tracking-wider mb-3.5 text-[11px]">Core Platform</h4>
            <ul className="space-y-2.5 font-sans">
              <li><Link to="/projects" className="hover:text-cyan transition-colors">Featured Projects</Link></li>
              <li><Link to="/research" className="hover:text-cyan transition-colors">Research Papers</Link></li>
              <li><Link to="/knowledge" className="hover:text-emerald transition-colors">Technical Knowledge Base</Link></li>
              <li><Link to="/technologies" className="hover:text-indigo transition-colors">Technology Explorer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-typo-secondary uppercase tracking-wider mb-3.5 text-[11px]">Discover & Media</h4>
            <ul className="space-y-2.5 font-sans">
              <li><Link to="/journey" className="hover:text-cyan transition-colors">Learning Journey Timeline</Link></li>
              <li><Link to="/cv" className="hover:text-cyan transition-colors">Official CV Document</Link></li>
              <li><Link to="/about" className="hover:text-cyan transition-colors">About & Direction</Link></li>
              <li><Link to="/contact" className="hover:text-cyan transition-colors">Get In Touch</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-mono text-typo-secondary uppercase tracking-wider mb-3.5 text-[11px]">Connect</h4>
            <div className="flex items-center gap-2.5">
              <a href={footerData?.githubUrl || footerData?.github || "https://github.com/Rjkl003CR"} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-muted hover:text-cyan hover:border-cyan/30 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href={footerData?.linkedinUrl || footerData?.linkedin || "https://www.linkedin.com/in/chamathka-ranathunga-a825922aa"} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-muted hover:text-indigo hover:border-indigo/30 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={footerData?.youtubeUrl || footerData?.youtube || "https://youtube.com"} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-muted hover:text-cyan hover:border-cyan/30 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href={footerData?.twitterUrl || footerData?.twitter || "https://twitter.com"} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-muted hover:text-cyan hover:border-cyan/30 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
            <p className="mt-4 text-[11px] text-typo-veryMuted font-mono">
              Built with React, Vite, Tailwind CSS, & Spring Boot API.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-obsidian-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-typo-veryMuted font-mono">
          <p>{copyrightText}</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="hover:text-cyan transition-colors font-mono">Admin Portal</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-cyan transition-colors font-mono">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
