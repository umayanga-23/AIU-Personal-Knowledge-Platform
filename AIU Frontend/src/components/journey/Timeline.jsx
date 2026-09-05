import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Rocket, BookOpen } from 'lucide-react';

export function Timeline({ journey = [] }) {
  const defaultJourney = [
    {
      id: 'j-1',
      date: 'Q1 2026',
      title: 'Full-Stack Architecture & Microservices Master',
      learned: 'Spring Boot 3, Next.js App Router, Supabase PostgreSQL RLS security, and Vector indexing.',
      built: 'FixZone Multi-tenant Platform & DocuSphere Knowledge RAG Engine.',
      technologies: ['spring-boot', 'nextjs', 'postgresql', 'docker']
    },
    {
      id: 'j-2',
      date: 'Q4 2025',
      title: 'Embedded Microcontrollers & Wireless IoT Systems',
      learned: 'ESP32 C++ Microcontroller programming, LoRa 915MHz long-range packet decoding, and sensor arrays.',
      built: 'LoRa 10 Emergency Hiker Tracking System with OLED telemetry.',
      technologies: ['esp32-lora', 'cpp', 'iot']
    },
    {
      id: 'j-3',
      date: 'Q1 2024',
      title: 'University of Moratuwa BSc IT Foundation',
      learned: 'Object-Oriented Programming (Java), Data Structures & Algorithms, and relational database normalization.',
      built: 'Academic management systems and algorithmic benchmark suites.',
      technologies: ['java', 'mysql', 'algorithms']
    }
  ];

  const list = journey || [];

  return (
    <div className="relative border-l-2 border-obsidian-border ml-4 md:ml-8 space-y-10 py-4 font-sans">
      {list.map((item, index) => (
        <div key={item.id || index} className="relative pl-8 md:pl-10 group">
          {/* Glowing Node Dot */}
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-obsidian-base border-2 border-cyan group-hover:scale-125 group-hover:bg-cyan transition-all duration-300 shadow-glow-cyan"></div>

          {/* Timeline Card */}
          <div className="glass-card-hover p-6 rounded-2xl border border-obsidian-border hover:border-cyan/40 transition-all duration-300 space-y-4">
            {/* Header Date & Title */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-obsidian-border pb-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan border border-cyan-500/20 flex items-center gap-1.5 shadow-glow-cyan">
                <Calendar className="w-3.5 h-3.5" /> {item.date}
              </span>
              <h3 className="text-lg font-bold text-typo-primary font-sans">{item.title}</h3>
            </div>

            {/* Content: Learned & Built */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-obsidian-surface/80 border border-obsidian-border space-y-2">
                <h4 className="font-semibold text-cyan flex items-center gap-1.5 uppercase font-mono tracking-wider">
                  <BookOpen className="w-4 h-4" /> What I Learned
                </h4>
                <p className="text-typo-secondary leading-relaxed">{item.learned}</p>
              </div>

              <div className="p-4 rounded-xl bg-obsidian-surface/80 border border-obsidian-border space-y-2">
                <h4 className="font-semibold text-indigo flex items-center gap-1.5 uppercase font-mono tracking-wider">
                  <Rocket className="w-4 h-4" /> What I Built
                </h4>
                <p className="text-typo-secondary leading-relaxed">{item.built}</p>
              </div>
            </div>

            {/* Technologies Badges */}
            {item.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.technologies.map(t => (
                  <Link
                    key={t}
                    to={`/technologies/${t}`}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-obsidian-elevated text-typo-secondary border border-obsidian-border hover:border-cyan/40 hover:text-cyan transition-colors"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
