import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';

export function AdminHeader({ title = "Dashboard" }) {
  const [userEmail, setUserEmail] = useState(() => authService.getCachedSession()?.user?.email || 'admin');

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      if (user?.email) setUserEmail(user.email);
    });
  }, []);

  return (
    <header className="h-16 border-b border-obsidian-border bg-obsidian-secondary/80 backdrop-blur-md px-6 flex items-center justify-between font-sans">
      <h1 className="text-lg font-bold text-typo-primary font-sans">{title}</h1>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-surface border border-obsidian-border hover:border-cyan/40 text-xs font-mono text-typo-secondary hover:text-cyan transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5 text-cyan" /> View Public Site
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-xs font-mono text-typo-secondary">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-typo-primary truncate max-w-[140px]">{userEmail}</span>
        </div>
      </div>
    </header>
  );
}
