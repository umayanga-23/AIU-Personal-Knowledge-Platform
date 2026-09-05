import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { authService } from '../../services/authService';
import { updateStore } from '../../services/apiClient';
import { INITIAL_DATA } from '../../data/mockData';

export function AdminHeader({ title = "Dashboard" }) {
  const user = authService.getCurrentUser();

  const handleResetStore = () => {
    if (window.confirm('Clear all cached mock entries and reset store to 100% clean state?')) {
      localStorage.removeItem('aiu_platform_store');
      updateStore(() => ({ ...INITIAL_DATA }));
      if (typeof window !== 'undefined') window.location.reload();
    }
  };

  return (
    <header className="h-16 border-b border-obsidian-border bg-obsidian-secondary/80 backdrop-blur-md px-6 flex items-center justify-between font-sans">
      <h1 className="text-lg font-bold text-typo-primary font-sans">{title}</h1>

      <div className="flex items-center gap-3">
        <button
          onClick={handleResetStore}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-mono text-rose-400 transition-all cursor-pointer shadow-sm"
          title="Clear cached mock items and start clean"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Reset Store to Clean State
        </button>

        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-surface border border-obsidian-border hover:border-cyan/40 text-xs font-mono text-typo-secondary hover:text-cyan transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5 text-cyan" /> View Public Site
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-xs font-mono text-typo-secondary">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-typo-primary truncate max-w-[140px]">{user?.username || 'admin'}</span>
        </div>
      </div>
    </header>
  );
}
