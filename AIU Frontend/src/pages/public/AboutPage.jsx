import React, { useEffect, useState } from 'react';
import { getStore } from '../../services/apiClient';
import { LoadingState } from '../../components/common/LoadingState';
import { AboutSection } from '../../components/home/AboutSection';
import { SkillsSection } from '../../components/home/SkillsSection';
import { EducationSection } from '../../components/home/EducationSection';
import { AwardsSection } from '../../components/home/AwardsSection';
import { LeadershipSection } from '../../components/home/LeadershipSection';

export function AboutPage() {
  const [profile, setProfile] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getStore();
    setProfile(data.profile);
    setStore(data);
    setLoading(false);
  }, []);

  if (loading || !profile || !store) return <LoadingState message="Loading About Me details..." />;

  return (
    <div className="space-y-0 py-8">
      {/* Bio Overview */}
      <AboutSection profile={profile} />

      {/* Technical Skills */}
      <SkillsSection skills={store.skills} />

      {/* Academic Timeline */}
      <EducationSection education={store.education} />

      {/* Certifications & Awards */}
      <AwardsSection awards={store.awards} />

      {/* Leadership Experience */}
      <LeadershipSection leadership={store.leadership} />
    </div>
  );
}
