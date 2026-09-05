import React from 'react';
import { GraduationCap } from 'lucide-react';

export function EducationSection({ education }) {
  const defaultEducation = [
    {
      id: "edu-1",
      degree: "BSc (Hons) in Information Technology",
      institution: "University of Moratuwa",
      year: "Expected 2028",
      location: "Moratuwa, Sri Lanka",
      details: "Focusing on Software Architecture, Distributed Systems, Database Management, and Web Engineering."
    },
    {
      id: "edu-2",
      degree: "G.C.E. Advanced Level (A/L)",
      institution: "Narammala Mayurapada Central College",
      year: "2022",
      location: "Kurunegala, Sri Lanka",
      details: "Combined Maths (B), Physics (B), Chemistry (A) — Z-Score: 1.6516"
    },
    {
      id: "edu-3",
      degree: "G.C.E. Ordinary Level (O/L)",
      institution: "Narammala Mayurapada Central College",
      year: "2019",
      location: "Kurunegala, Sri Lanka",
      details: "9 A's (including Mathematics, Science, and English)"
    }
  ];

  const eduList = education && education.length > 0 ? education : defaultEducation;

  return (
    <section id="education" className="py-20 border-t border-obsidian-border bg-obsidian-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div>
          <span className="text-xs font-mono text-cyan uppercase tracking-widest flex items-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-cyan" /> [ ACADEMICS ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-typo-primary tracking-tight">
            Education Path
          </h2>
        </div>

        {/* Timeline Grid */}
        <div className="relative pl-6 sm:pl-8 border-l border-obsidian-border space-y-10">
          {eduList.map((item, idx) => (
            <div key={item.id || idx} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-cyan border-2 border-obsidian-base shadow-glow-cyan group-hover:scale-125 transition-transform" />

              {/* Card Container */}
              <div className="glass-card p-6 rounded-2xl space-y-2.5 max-w-3xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-lg font-bold text-typo-primary font-sans">{item.degree}</h3>
                  <span className="text-xs font-mono font-semibold text-cyan bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 w-fit">
                    {item.year}
                  </span>
                </div>

                <p className="text-sm font-semibold text-indigo">{item.institution}</p>
                
                <p className="text-xs font-mono text-typo-veryMuted">{item.location}</p>

                {item.details && (
                  <p className="text-xs sm:text-sm text-typo-secondary leading-relaxed pt-1">
                    {item.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
