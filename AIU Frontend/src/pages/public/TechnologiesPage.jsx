import React, { useEffect, useState } from 'react';
import { technologyService } from '../../services/technologyService';
import { TechnologyCard } from '../../components/cards/TechnologyCard';
import { LoadingState, SkeletonGrid } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { FilterBar } from '../../components/common/FilterBar';

export function TechnologiesPage() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await technologyService.getAllPublic();
      setTechnologies(data);
    } catch (err) {
      setError(err.message || 'Failed to load technologies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = ['Programming', 'Frameworks', 'Databases', 'Cloud', 'DevOps', 'AI', 'Tools'];

  const filteredTechnologies = selectedCategory === 'ALL'
    ? technologies
    : technologies.filter(t => t.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">Technology Explorer</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Core technology stack, frameworks, databases, and DevOps tooling powering my system engineering projects.
        </p>
      </div>

      {/* Filter */}
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Grid */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTechnologies.map((tech) => (
            <TechnologyCard key={tech.id} tech={tech} />
          ))}
        </div>
      )}
    </div>
  );
}
