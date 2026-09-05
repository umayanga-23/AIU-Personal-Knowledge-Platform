import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { researchService } from '../../services/researchService';
import { getStore } from '../../services/apiClient';
import { ResearchCard } from '../../components/cards/ResearchCard';
import { SearchBar } from '../../components/common/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import { SkeletonGrid } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { SeoHead } from '../../components/common/SeoHead';

export function ResearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read filter state directly from URL query parameters
  const search = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 6;

  // Helper to sync filter changes with URL Search Params
  const updateUrlParams = (updatedFields) => {
    const params = new URLSearchParams(searchParams);
    
    const newSearch = updatedFields.search !== undefined ? updatedFields.search : search;
    const newPage = updatedFields.page !== undefined ? updatedFields.page : (updatedFields.page === undefined ? 1 : currentPage);

    if (newSearch) params.set('search', newSearch); else params.delete('search');
    if (newPage && newPage > 1) params.set('page', String(newPage)); else params.delete('page');

    setSearchParams(params, { replace: true });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const resData = await researchService.getAllPublic().catch(() => null);
      const raw = Array.isArray(resData) ? resData : (resData?.data?.content || resData?.data || resData?.content || null);
      const store = getStore();
      const finalResearch = (raw && raw.length > 0) ? raw : (store?.research || []);
      setResearchList(finalResearch);
    } catch (err) {
      const store = getStore();
      setResearchList(store?.research || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredResearch = useMemo(() => {
    if (!Array.isArray(researchList)) return [];
    return researchList.filter((r) => {
      if (!r) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      const title = r.title || '';
      const abstract = r.abstract || '';
      return title.toLowerCase().includes(q) ||
        abstract.toLowerCase().includes(q) ||
        (Array.isArray(r.tags) && r.tags.some(t => String(t).toLowerCase().includes(q)));
    });
  }, [researchList, search]);

  const totalPages = Math.ceil(filteredResearch.length / pageSize) || 1;
  const paginatedResearch = filteredResearch.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SeoHead
        title="Research & Publications"
        description="Academic whitepapers, empirical algorithm studies, and system performance benchmarks published in IEEE and ACM venues."
      />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-typo-primary font-sans">Research & Publications</h1>
        <p className="text-sm text-typo-secondary max-w-2xl font-sans">
          Academic whitepapers, empirical algorithm studies, and system performance benchmarks published in IEEE and ACM venues.
        </p>
      </div>

      {/* Search Bar with URL Sync */}
      <SearchBar
        value={search}
        onChange={(val) => updateUrlParams({ search: val, page: 1 })}
        placeholder="Search research papers by keyword, abstract, or algorithm tag..."
      />

      {/* Content */}
      {loading ? (
        <SkeletonGrid count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : paginatedResearch.length === 0 ? (
        <EmptyState
          title="No research publications found"
          description="Try broadening your search term."
          actionLabel="Clear Search"
          onAction={() => updateUrlParams({ search: '', page: 1 })}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedResearch.map((paper) => (
              <ResearchCard key={paper.id} research={paper} />
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
