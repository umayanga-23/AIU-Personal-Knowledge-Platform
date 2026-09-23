import React, { useEffect, useState } from 'react';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { AboutSection } from '../../components/home/AboutSection';
import { SkillsSection } from '../../components/home/SkillsSection';
import { EducationSection } from '../../components/home/EducationSection';
import { AwardsSection } from '../../components/home/AwardsSection';
import { LeadershipSection } from '../../components/home/LeadershipSection';
import { profileService } from '../../services/profileService';
import { skillService } from '../../services/skillService';
import { educationService } from '../../services/educationService';
import { awardService } from '../../services/awardService';
import { leadershipService } from '../../services/leadershipService';

export function AboutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [profile, skills, education, awards, leadership] = await Promise.all([
        profileService.get(),
        skillService.getAll(),
        educationService.getAll(),
        awardService.getAll(),
        leadershipService.getAll()
      ]);

      setData({
        profile: profile || {},
        skills: skills || [],
        education: education || [],
        awards: awards || [],
        leadership: leadership || []
      });
    } catch (err) {
      console.error('Failed to load about data:', err);
      setError(err.message || 'Unable to connect to Supabase database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading About Me details..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  if (!data) return null;

  return (
    <div className="space-y-0 py-8">
      {/* Bio Overview */}
      <AboutSection profile={data.profile} />

      {/* Technical Skills */}
      <SkillsSection skills={data.skills} />

      {/* Academic Timeline */}
      <EducationSection education={data.education} />

      {/* Certifications & Awards */}
      <AwardsSection awards={data.awards} />

      {/* Leadership Experience */}
      <LeadershipSection leadership={data.leadership} />
    </div>
  );
}
