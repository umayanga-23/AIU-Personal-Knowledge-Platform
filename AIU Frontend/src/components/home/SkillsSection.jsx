import React from 'react';
import { Code2, Database, Wrench, BookOpen, Cloud, Cpu, ShieldCheck, Globe, BrainCircuit } from 'lucide-react';

export function SkillsSection({ skills }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-5 h-5 text-cyan" />;
      case 'Database': return <Database className="w-5 h-5 text-cyan" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-cyan" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-cyan" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-cyan" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-cyan" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-cyan" />;
      case 'Globe': return <Globe className="w-5 h-5 text-cyan" />;
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5 text-cyan" />;
      default: return <Code2 className="w-5 h-5 text-cyan" />;
    }
  };

  const defaultSkills = [
    {
      category: "Languages & Frameworks",
      icon: "Code2",
      items: ["Java", "JavaScript", "TypeScript", "Spring Boot", "Next.js", "React.js"]
    },
    {
      category: "Data & Cloud",
      icon: "Database",
      items: ["PostgreSQL", "MySQL", "SQL", "Supabase", "Vercel"]
    },
    {
      category: "Dev & Architecture",
      icon: "Wrench",
      items: ["Git", "GitHub", "Jira", "REST APIs", "Docker"]
    },
    {
      category: "Analytical Skills",
      icon: "BookOpen",
      items: ["Agile/Scrum", "Requirements Analysis", "Process Modeling", "Stakeholder Comm."]
    }
  ];

  const skillList = skills && skills.length > 0 ? skills : defaultSkills;

  return (
    <section id="skills" className="py-20 border-t border-obsidian-border bg-obsidian-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div>
          <span className="text-xs font-mono text-cyan uppercase tracking-widest flex items-center gap-2 mb-2">
            <Code2 className="w-4 h-4 text-cyan" /> [ WHAT I WORK WITH ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-typo-primary tracking-tight">
            Technical Expertise
          </h2>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillList.map((skillGroup, idx) => (
            <div key={idx} className="glass-card-hover p-6 rounded-2xl flex flex-col justify-between h-full space-y-5">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-glow-cyan">
                  {getIcon(skillGroup.icon)}
                </div>
                <h3 className="text-lg font-bold text-typo-primary font-sans">
                  {skillGroup.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {skillGroup.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-xl text-xs font-mono bg-obsidian-elevated/80 text-typo-secondary border border-obsidian-border hover:border-cyan/40 hover:text-cyan transition-all"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
