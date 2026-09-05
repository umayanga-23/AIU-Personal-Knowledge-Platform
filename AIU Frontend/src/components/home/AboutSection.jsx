import React from 'react';
import { Users, MapPin, Mail, Phone, Github, Linkedin, ArrowUpRight } from 'lucide-react';

export function AboutSection({ profile }) {
  return (
    <section id="about" className="py-20 border-t border-obsidian-border bg-obsidian-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div>
          <span className="text-xs font-mono text-cyan uppercase tracking-widest flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-cyan" /> [ WHO I AM ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-typo-primary tracking-tight">
            About Me
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Bio text dynamically bound to profile.bio */}
          <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-typo-secondary leading-relaxed font-sans whitespace-pre-line">
            {profile?.bio ? (
              <p>{profile.bio}</p>
            ) : (
              <>
                <p>
                  I am an Information Technology undergraduate at the <strong className="text-typo-primary font-bold">University of Moratuwa</strong> with a passion for software design and system architecture. I enjoy translating complex business domain problems into scalable web applications and optimizing system workflows.
                </p>
                <p>
                  My hands-on experience spans working with full-stack web technologies like <strong className="text-typo-primary font-bold">Next.js, Spring Boot, and PostgreSQL</strong>, down to modern embedded IoT development using ESP32. I actively participate in hackathons, university leadership roles, and tech events.
                </p>
                <p>
                  I am actively seeking <strong className="text-cyan font-semibold">Software Engineering</strong> and <strong className="text-cyan font-semibold">Business Analyst internship</strong> opportunities where I can apply my dual focus on technical development and analytical problem-solving to real business challenges.
                </p>
              </>
            )}
          </div>

          {/* Quick Contact & Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-6 rounded-2xl space-y-4 font-mono">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-typo-secondary">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan border border-cyan-500/20">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>{profile?.location || "Moratuwa, Sri Lanka"}</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-typo-secondary">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan border border-cyan-500/20">
                  <Mail className="w-4 h-4" />
                </div>
                <a href={`mailto:${profile?.email || 'rjklcr003@gmail.com'}`} className="hover:text-cyan transition-colors">
                  {profile?.email || "rjklcr003@gmail.com"}
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-typo-secondary">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan border border-cyan-500/20">
                  <Phone className="w-4 h-4" />
                </div>
                <a href={`tel:${profile?.phone || '+94765923995'}`} className="hover:text-cyan transition-colors">
                  {profile?.phone || "+94 76 592 3995"}
                </a>
              </div>

              <div className="pt-4 border-t border-obsidian-border flex items-center gap-4">
                <a
                  href={profile?.github || "https://github.com/Rjkl003CR"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-typo-secondary hover:text-cyan transition-colors"
                >
                  <Github className="w-4 h-4 text-cyan" />
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 text-cyan" />
                </a>

                <a
                  href={profile?.linkedin || "https://www.linkedin.com/in/chamathka-ranathunga-a825922aa"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-typo-secondary hover:text-cyan transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-cyan" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-cyan" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
