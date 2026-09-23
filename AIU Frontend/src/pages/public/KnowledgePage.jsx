import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { technologyService } from '../../services/technologyService';
import { ArticleCard } from '../../components/cards/ArticleCard';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterBar } from '../../components/common/FilterBar';
import { Pagination } from '../../components/common/Pagination';
import { SkeletonGrid } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { SeoHead } from '../../components/common/SeoHead';

export function KnowledgePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [articles, setArticles] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read filter state directly from URL query parameters
  const search = searchParams.get('search') || '';
  const selectedTech = searchParams.get('tech') || 'ALL';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 6;

  // Helper to sync filter changes with URL Search Params
  const updateUrlParams = (updatedFields) => {
    const params = new URLSearchParams(searchParams);
    
    const newSearch = updatedFields.search !== undefined ? updatedFields.search : search;
    const newTech = updatedFields.tech !== undefined ? updatedFields.tech : selectedTech;
    const newPage = updatedFields.page !== undefined ? updatedFields.page : (updatedFields.page === undefined ? 1 : currentPage);

    if (newSearch) params.set('search', newSearch); else params.delete('search');
    if (newTech && newTech !== 'ALL') params.set('tech', newTech); else params.delete('tech');
    if (newPage && newPage > 1) params.set('page', String(newPage)); else params.delete('page');

    setSearchParams(params, { replace: true });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [artData, techData] = await Promise.all([
        articleService.getAllPublic(),
        technologyService.getAllPublic()
      ]);

      setArticles(artData || []);
      setTechnologies(techData || []);
    } catch (err) {
      console.error('Failed to load articles:', err);
      setError(err.message || 'Unable to retrieve knowledge articles from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredArticles = useMemo(() => {
    if (!Array.isArray(articles)) return [];
    return articles.filter((a) => {
      if (!a) return false;
      const title = a.title || '';
      const excerpt = a.excerpt || '';
      const matchesSearch = !search || 
        title.toLowerCase().includes(search.toLowerCase()) ||
        excerpt.toLowerCase().includes(search.toLowerCase());

      const matchesTech = selectedTech === 'ALL' || a.technology === selectedTech;

      return matchesSearch && matchesTech;
    });
  }, [articles, search, selectedTech]);

  const totalPages = Math.ceil(filteredArticles.length / pageSize) || 1;
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SeoHead
        title="Technical Knowledge Notes"
        description="Deep-dive technical articles, architectural patterns, database optimizations, and system engineering tutorials."
      />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-typo-primary font-sans">Technical Knowledge Notes</h1>
        <p className="text-sm text-typo-secondary max-w-2xl font-sans">
          Deep-dive technical articles, architectural patterns, database optimizations, and system engineering tutorials.
        </p>
      </div>

      {/* Controls with URL Sync */}
      <div className="space-y-4">
        <SearchBar
          value={search}
          onChange={(val) => updateUrlParams({ search: val, page: 1 })}
          placeholder="Search technical notes by topic, code snippet, or technology..."
        />
        <FilterBar
          categories={[]}
          selectedCategory="ALL"
          onCategoryChange={() => {}}
          technologies={technologies}
          selectedTech={selectedTech}
          onTechChange={(t) => updateUrlParams({ tech: t, page: 1 })}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : paginatedArticles.length === 0 ? (
        <EmptyState
          title="No technical notes match your query"
          description="Try selecting a different technology category."
          actionLabel="Clear Filters"
          onAction={() => updateUrlParams({ search: '', tech: 'ALL', page: 1 })}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => updateUrlParams({ page })}
            />
          )}
        </>
      )}
    </div>
  );
}
