import React, { useEffect, useState } from 'react';
import { getStore } from '../../services/apiClient';
import { LoadingState } from '../../components/common/LoadingState';
import { ContactSection } from '../../components/home/ContactSection';

export function ContactPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getStore();
    setProfile(data.profile);
    setLoading(false);
  }, []);

  if (loading || !profile) return <LoadingState message="Loading Contact details..." />;

  return (
    <div className="py-8">
      <ContactSection profile={profile} />
    </div>
  );
}
