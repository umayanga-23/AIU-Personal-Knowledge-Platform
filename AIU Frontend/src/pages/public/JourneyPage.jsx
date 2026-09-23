import React, { useEffect, useState } from 'react';
import { journeyService } from '../../services/journeyService';
import { Timeline } from '../../components/journey/Timeline';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { Milestone } from 'lucide-react';

export function JourneyPage() {
  const [journey, setJourney] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await journeyService.getAllPublic();
      setJourney(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load journey timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 font-sans">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-mono text-cyan uppercase tracking-widest flex items-center gap-2">
          <Milestone className="w-4 h-4 text-cyan" /> [ GROWTH TIMELINE ]
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-typo-primary tracking-tight font-sans">
          Learning Journey & Growth Timeline
        </h1>
        <p className="text-base text-typo-secondary max-w-2xl leading-relaxed">
          An interactive chronological timeline tracking technical topics learned, software architecture milestones achieved, and embedded IoT systems built by Induwara Umayanga Alukirthi.
        </p>
      </div>

      {loading ? (
        <LoadingState message="Loading timeline milestones..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <Timeline journey={journey} />
      )}
    </div>
  );
}
