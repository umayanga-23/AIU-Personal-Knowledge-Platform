import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { technologyService } from '../../services/technologyService';
import { getStore } from '../../services/apiClient';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterBar } from '../../components/common/FilterBar';
import { Pagination } from '../../components/common/Pagination';
import { SkeletonGrid } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { SeoHead } from '../../components/common/SeoHead';

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read filter state directly from URL query parameters
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'ALL';
  const selectedTech = searchParams.get('tech') || 'ALL';
  const sortBy = searchParams.get('sort') || 'NEWEST';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 6;

  // Helper to sync filter changes with URL Search Params
  const updateUrlParams = (updatedFields) => {
    const params = new URLSearchParams(searchParams);
    
    // Merge new updates
    const newSearch = updatedFields.search !== undefined ? updatedFields.search : search;
    const newCategory = updatedFields.category !== undefined ? updatedFields.category : selectedCategory;
    const newTech = updatedFields.tech !== undefined ? updatedFields.tech : selectedTech;
    const newSort = updatedFields.sort !== undefined ? updatedFields.sort : sortBy;
    const newPage = updatedFields.page !== undefined ? updatedFields.page : (updatedFields.page === undefined ? 1 : currentPage);

    if (newSearch) params.set('search', newSearch); else params.delete('search');
    if (newCategory && newCategory !== 'ALL') params.set('category', newCategory); else params.delete('category');
    if (newTech && newTech !== 'ALL') params.set('tech', newTech); else params.delete('tech');
    if (newSort && newSort !== 'NEWEST') params.set('sort', newSort); else params.delete('sort');
    if (newPage && newPage > 1) params.set('page', String(newPage)); else params.delete('page');

    setSearchParams(params, { replace: true });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projData, techData] = await Promise.all([
        projectService.getAllPublic().catch(() => null),
        technologyService.getAllPublic().catch(() => null)
      ]);

      const rawProjects = Array.isArray(projData) ? projData : (projData?.data?.content || projData?.data || projData?.content || null);
      const rawTech = Array.isArray(techData) ? techData : (techData?.data?.content || techData?.data || techData?.content || null);

      const store = getStore();
      const finalProjects = (rawProjects && rawProjects.length > 0) ? rawProjects : (store?.projects || []);
      const finalTech = (rawTech && rawTech.length > 0) ? rawTech : (store?.technologies || []);

      setProjects(finalProjects);
      setTechnologies(finalTech);
    } catch (err) {
      const store = getStore();
      setProjects(store?.projects || []);
      setTechnologies(store?.technologies || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = ['Featured Only', 'Full-Stack', 'Backend', 'AI & ML'];

  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    return projects.filter((p) => {
      if (!p) return false;
      const title = p.title || '';
      const desc = p.shortDescription || p.description || '';

      // Search
      const matchesSearch = !search || 
        title.toLowerCase().includes(search.toLowerCase()) ||
        desc.toLowerCase().includes(search.toLowerCase());

      // Category filter
      let matchesCategory = true;
      if (selectedCategory === 'Featured Only') matchesCategory = !!p.featured;
      else if (selectedCategory !== 'ALL') {
        matchesCategory = title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          desc.toLowerCase().includes(selectedCategory.toLowerCase());
      }

      // Tech filter
      const matchesTech = selectedTech === 'ALL' || (Array.isArray(p.technologies) && p.technologies.includes(selectedTech));

      return matchesSearch && matchesCategory && matchesTech;
    }).sort((a, b) => {
      const idA = String(a?.id || '');
      const idB = String(b?.id || '');
      const titleA = String(a?.title || '');
      const titleB = String(b?.title || '');

      if (sortBy === 'NEWEST') return idB.localeCompare(idA);
      if (sortBy === 'TITLE') return titleA.localeCompare(titleB);
      return 0;
    });
  }, [projects, search, selectedCategory, selectedTech, sortBy]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SeoHead
        title="Projects Showcase"
        description="Discover open-source engines, enterprise multi-tenant applications, and IoT safety systems engineered by Induwara Umayanga Alukirthi."
      />

      {/* Header Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-typo-primary font-sans">Projects Showcase</h1>
        <p className="text-sm text-typo-secondary max-w-2xl font-sans">
          Discover open-source engines, enterprise multi-tenant applications, and IoT safety systems engineered by Induwara Umayanga Alukirthi.
        </p>
      </div>

      {/* Controls Bar with URL Sync */}
      <div className="space-y-4">
        <SearchBar
          value={search}
          onChange={(val) => updateUrlParams({ search: val, page: 1 })}
          placeholder="Search projects by title, technology, or domain..."
        />
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => updateUrlParams({ category: cat, page: 1 })}
          sortOptions={[
            { label: 'Newest First', value: 'NEWEST' },
            { label: 'Alphabetical', value: 'TITLE' },
          ]}
          sortBy={sortBy}
          onSortChange={(sort) => updateUrlParams({ sort, page: 1 })}
          technologies={technologies}
          selectedTech={selectedTech}
          onTechChange={(t) => updateUrlParams({ tech: t, page: 1 })}
        />
      </div>

      {/* Grid Content */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : paginatedProjects.length === 0 ? (
        <EmptyState
          title="No projects match your filter criteria"
          description="Try resetting search or technology tag selections."
          actionLabel="Reset All Filters"
          onAction={() => updateUrlParams({ search: '', category: 'ALL', tech: 'ALL', sort: 'NEWEST', page: 1 })}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
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
