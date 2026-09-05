import React from 'react';

export function StatsCard({ title, count, subtitle, icon: Icon, color = "cyan" }) {
  const colorStyles = {
    teal: 'bg-cyan-500/10 text-cyan border-cyan-500/20 shadow-glow-cyan',
    cyan: 'bg-cyan-500/10 text-cyan border-cyan-500/20 shadow-glow-cyan',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-glow-emerald',
    purple: 'bg-indigo-500/10 text-indigo border-indigo-500/20 shadow-glow-indigo',
    indigo: 'bg-indigo-500/10 text-indigo border-indigo-500/20 shadow-glow-indigo',
    rose: 'bg-indigo-500/10 text-indigo border-indigo-500/20',
    amber: 'bg-cyan-500/10 text-cyan border-cyan-500/20',
  };

  return (
    <div className="p-6 glass-card rounded-2xl flex items-center justify-between space-x-4">
      <div>
        <p className="text-xs font-mono text-typo-secondary uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-extrabold text-typo-primary mt-1.5 font-mono">{count}</h3>
        {subtitle && <p className="text-[11px] text-typo-muted mt-1">{subtitle}</p>}
      </div>

      <div className={`p-3.5 rounded-2xl border ${colorStyles[color] || colorStyles.cyan}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
