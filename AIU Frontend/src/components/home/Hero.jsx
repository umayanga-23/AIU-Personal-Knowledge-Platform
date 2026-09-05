import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Download, Github, Linkedin, Mail, ArrowRight, ShieldCheck, BookOpen, FileText } from 'lucide-react';
import { pdfStorage } from '../../utils/pdfStorage';
import { formatImageUrl } from '../../utils/formValidation';

export function Hero({ profile, onCvClick }) {
  const handleCvDownload = async (e) => {
    e.preventDefault();
    if (onCvClick) onCvClick();
    let cvUrl = profile?.cv?.fileUrl || profile?.cvUrl;

    if (!cvUrl || cvUrl === 'PERSISTED_IN_INDEXEDDB') {
      const persistedData = await pdfStorage.getPdf('active_cv');
      if (persistedData) cvUrl = persistedData;
    }

    if (!cvUrl) {
      cvUrl = "https://aiu-portfolio.supabase.co/storage/v1/object/public/cv/Induwara_Umayanga_Alukirthi_CV.pdf";
    }

    const fileName = profile?.cv?.fileName || "Induwara_Umayanga_Alukirthi_CV.pdf";
    pdfStorage.triggerDownload(cvUrl, fileName);
  };
  return (
    <section id="hero" className="relative pt-16 pb-24 overflow-hidden bg-mesh-glow">
      {/* Subtle Ambient Background Glow Spheres */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bio & Intro */}
          <div className="lg:col-span-8 space-y-7">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-mono bg-obsidian-surface/90 border border-emerald-500/30 text-emerald-400 backdrop-blur-xl shadow-glow-emerald">
              <span className="pulse-dot" />
              <span>Available for Software Engineering & BA Internships</span>
            </div>

            {/* Name & Role */}
            <div className="space-y-3">
              <span className="text-sm font-mono text-typo-secondary uppercase tracking-widest block">Hello, I'm</span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-typo-primary leading-[1.1]">
                {profile?.name || "Induwara Umayanga Alukirthi"}
              </h1>
              <p className="text-2xl sm:text-3xl font-bold text-gradient-cyan-indigo">
                {profile?.role || "Full-Stack Developer & IT Undergraduate"}
              </p>
            </div>

            {/* Sub description dynamically bound to profile.heroDescription */}
            <p className="text-base sm:text-lg text-typo-secondary leading-relaxed max-w-2xl font-normal">
              {profile?.heroDescription || "BSc (Hons) in Information Technology Undergraduate at University of Moratuwa. Translating complex business problems into high-performance web applications and embedded IoT solutions."}
            </p>

            {/* Interest Chips */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {['Spring Boot', 'Next.js', 'PostgreSQL', 'React', 'IoT & ESP32'].map(interest => (
                <span key={interest} className="px-3.5 py-1.5 rounded-xl text-xs font-mono bg-obsidian-surface/80 text-typo-secondary border border-obsidian-border flex items-center gap-2 hover:-translate-y-0.5 hover:border-cyan/30 hover:text-cyan transition-all">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan" /> {interest}
                </span>
              ))}
            </div>

            {/* CTA Button Group (Explore My Work, Research, Knowledge, Download CV) */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan to-indigo hover:from-cyan-dark hover:to-indigo hover:-translate-y-0.5 text-slate-950 font-extrabold text-sm rounded-xl shadow-glow-cyan transition-all"
              >
                <Code2 className="w-4 h-4 text-slate-950" />
                <span>Explore Work</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>

              <Link
                to="/research"
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-obsidian-surface/90 hover:bg-obsidian-elevated text-typo-primary hover:text-cyan border border-obsidian-border hover:border-cyan/40 font-semibold text-sm rounded-xl transition-all hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4 text-cyan" />
                <span>Research</span>
              </Link>

              <Link
                to="/knowledge"
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-obsidian-surface/90 hover:bg-obsidian-elevated text-typo-primary hover:text-cyan border border-obsidian-border hover:border-cyan/40 font-semibold text-sm rounded-xl transition-all hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4 text-cyan" />
                <span>Knowledge</span>
              </Link>

              <button
                type="button"
                onClick={handleCvDownload}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-obsidian-surface/90 hover:bg-obsidian-elevated text-typo-primary hover:text-cyan border border-obsidian-border hover:border-cyan/40 font-semibold text-sm rounded-xl transition-all hover:-translate-y-0.5 font-sans"
              >
                <Download className="w-4 h-4 text-cyan" />
                <span>Download CV</span>
              </button>
            </div>

            {/* Quick Social Contacts */}
            <div className="flex items-center gap-4 pt-4 text-xs font-mono text-typo-muted">
              <a href={profile?.github || "https://github.com/Rjkl003CR"} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-cyan transition-colors">
                <Github className="w-4 h-4 text-cyan" /> GitHub
              </a>
              <span>•</span>
              <a href={profile?.linkedin || "https://www.linkedin.com/in/chamathka-ranathunga-a825922aa"} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-cyan transition-colors">
                <Linkedin className="w-4 h-4 text-cyan" /> LinkedIn
              </a>
              <span>•</span>
              <a href={`mailto:${profile?.email || 'rjklcr003@gmail.com'}`} className="flex items-center gap-1.5 hover:text-cyan transition-colors">
                <Mail className="w-4 h-4 text-cyan" /> Email
              </a>
            </div>
          </div>

          {/* Right Column: Profile Visual Frame */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan via-indigo to-emerald-400 blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-3xl overflow-hidden glass-card border border-cyan/30 flex items-center justify-center p-3 shadow-2xl">
                <img
                  src={formatImageUrl(profile?.profileImage) || "/induwara-profile.png"}
                  alt={profile?.name || "Induwara Umayanga Alukirthi"}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "/induwara-profile.png";
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
