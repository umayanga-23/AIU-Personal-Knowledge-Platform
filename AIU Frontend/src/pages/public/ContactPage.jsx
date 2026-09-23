import React, { useEffect, useState } from 'react';
import { profileService } from '../../services/profileService';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { ContactSection } from '../../components/home/ContactSection';

export function ContactPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.get();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile for contact page:', err);
      setError(err.message || 'Unable to load contact information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading Contact details..." />;
  if (error || !profile) return <ErrorState message={error || 'Unable to load contact info'} onRetry={loadData} />;

  return (
    <div className="py-8">
      <ContactSection profile={profile} />
    </div>
  );
}
