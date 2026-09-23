import React from 'react';
import { Users, ShieldCheck } from 'lucide-react';

export function LeadershipSection({ leadership }) {
  const leadList = Array.isArray(leadership) ? leadership : [];

  if (leadList.length === 0) return null;

  return (
    <section id="leadership" className="py-20 border-t border-obsidian-border bg-obsidian-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div>
          <span className="text-xs font-mono text-cyan uppercase tracking-widest flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-cyan" /> [ COMMUNITY & RESPONSIBILITIES ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-typo-primary tracking-tight">
            Leadership Experience
          </h2>
        </div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadList.map((item, idx) => (
            <div key={item.id || idx} className="glass-card-hover p-6 rounded-2xl space-y-3 flex flex-col justify-between h-full group">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan border border-cyan-500/20 shadow-glow-cyan">
                  {item.year}
                </span>
                <h3 className="text-lg font-bold text-typo-primary group-hover:text-cyan transition-colors">{item.title}</h3>
                <p className="text-xs font-semibold text-indigo">{item.organization}</p>
                <p className="text-xs text-typo-secondary leading-relaxed pt-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
