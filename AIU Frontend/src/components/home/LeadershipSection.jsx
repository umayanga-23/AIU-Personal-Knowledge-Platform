import React from 'react';
import { Users, ShieldCheck } from 'lucide-react';

export function LeadershipSection({ leadership }) {
  const defaultLeadership = [
    {
      id: "lead-1",
      title: "Main Batch Representative",
      organization: "Batch '23, Faculty of Information Technology",
      year: "2025 - 2026",
      description: "Represented 200+ students and actively coordinated with faculty on academic concerns and curriculum feedback."
    },
    {
      id: "lead-2",
      title: "HR Pillar Member",
      organization: "FIT MOMENT, IT Faculty Media Unit",
      year: "2025 - Present",
      description: "Managed recruitment pipelines for 15+ events and effectively coordinated tasks for 30+ team members."
    },
    {
      id: "lead-3",
      title: "Program & Event Coordination",
      organization: "IEEE WIE Student Branch Affinity Group",
      year: "2026 - Present",
      description: "Organized technical workshops and skill-building sessions reaching 100+ attendees."
    }
  ];

  const leadList = leadership && leadership.length > 0 ? leadership : defaultLeadership;

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
