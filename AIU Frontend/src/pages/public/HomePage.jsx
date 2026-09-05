import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowRight } from 'lucide-react';
import { Hero } from '../../components/home/Hero';
import { AboutSection } from '../../components/home/AboutSection';
import { SkillsSection } from '../../components/home/SkillsSection';
import { EducationSection } from '../../components/home/EducationSection';
import { JourneySection } from '../../components/home/JourneySection';
import { AwardsSection } from '../../components/home/AwardsSection';
import { LeadershipSection } from '../../components/home/LeadershipSection';
import { ResearchSection } from '../../components/home/ResearchSection';
import { ArticlesSection } from '../../components/home/ArticlesSection';
import { ContactSection } from '../../components/home/ContactSection';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { LoadingState } from '../../components/common/LoadingState';
import { getStore } from '../../services/apiClient';
import { SeoHead } from '../../components/common/SeoHead';

export function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncData = () => {
      const store = getStore();
      setData({ ...store });
      setLoading(false);
    };

    syncData();

    window.addEventListener('aiu_store_updated', syncData);
    window.addEventListener('storage', syncData);
    return () => {
      window.removeEventListener('aiu_store_updated', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  if (loading || !data) return <LoadingState message="Loading Knowledge Platform..." />;

  const featuredProjects = data.projects.filter(p => p.status === 'PUBLISHED').slice(0, 3);

  return (
    <div className="space-y-0 font-sans">
      <SeoHead
        title="Induwara Umayanga — Software Engineer & Researcher"
        description="Personal digital knowledge platform, research archive, technical articles, projects, and learning journey of Induwara Umayanga Alukirthi."
        image={data.profile?.avatarUrl}
      />

      {/* 1. Hero Section */}
      <Hero profile={data.profile} />

      {/* 2. About Me Section */}
      <AboutSection profile={data.profile} />

      {/* 3. Technical Skills Section */}
      <SkillsSection skills={data.skills} />

      {/* 4. Academic Education Path Section */}
      <EducationSection education={data.education} />

      {/* 5. Learning Journey & Growth Timeline Section */}
      <JourneySection journey={data.journey} />

      {/* 6. Featured Projects Section */}
      <section id="projects" className="py-20 border-t border-obsidian-border bg-obsidian-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-obsidian-border pb-5">
            <div>
              <span className="text-xs font-mono text-cyan uppercase tracking-widest flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4 text-cyan" /> [ WHAT I'VE BUILT ]
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-typo-primary tracking-tight font-sans">
                Featured Projects
              </h2>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:text-cyan-dark font-mono transition-colors">
              <span>View All Projects ({data.projects.filter(p => p.status === 'PUBLISHED').length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Certifications & Honors Section */}
      <AwardsSection awards={data.awards} />

      {/* 8. Leadership Experience Section */}
      <LeadershipSection leadership={data.leadership} />

      {/* 9. Dedicated Academic Research Papers Section */}
      <ResearchSection research={data.research} />

      {/* 10. Dedicated Technical Articles & Engineering Notes Section */}
      <ArticlesSection articles={data.articles} technologies={data.technologies} />

      {/* 11. Contact Me Section */}
      <ContactSection profile={data.profile} />
    </div>
  );
}
