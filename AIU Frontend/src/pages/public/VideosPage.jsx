import React, { useEffect, useState } from 'react';
import { videoService } from '../../services/videoService';
import { VideoCard } from '../../components/cards/VideoCard';
import { LoadingState, SkeletonGrid } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';

export function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await videoService.getAllPublic();
      setVideos(data);
    } catch (err) {
      setError(err.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">Project Videos & Walkthroughs</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Recorded architecture deep-dives, live benchmark demonstrations, and technical video tutorials.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <SkeletonGrid count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((vid) => (
            <VideoCard key={vid.id} video={vid} />
          ))}
        </div>
      )}
    </div>
  );
}
