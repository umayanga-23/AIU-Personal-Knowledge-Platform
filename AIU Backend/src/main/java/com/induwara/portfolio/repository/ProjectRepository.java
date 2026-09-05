package com.induwara.portfolio.repository;

import com.induwara.portfolio.entity.Project;
import com.induwara.portfolio.enums.ContentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    Optional<Project> findBySlug(String slug);
    Optional<Project> findBySlugAndStatus(String slug, ContentStatus status);

    Page<Project> findByStatus(ContentStatus status, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Project p " +
           "LEFT JOIN p.technologies tech " +
           "LEFT JOIN p.tags tag " +
           "WHERE p.status = :status " +
           "AND (CAST(:featured AS boolean) IS NULL OR p.featured = :featured) " +
           "AND (CAST(:techSlug AS string) IS NULL OR tech.slug = :techSlug) " +
           "AND (CAST(:tagSlug AS string) IS NULL OR tag.slug = :tagSlug)")
    Page<Project> findPublicProjectsFiltered(
            @Param("status") ContentStatus status,
            @Param("featured") Boolean featured,
            @Param("techSlug") String techSlug,
            @Param("tagSlug") String tagSlug,
            Pageable pageable
    );

    @Query("SELECT p FROM Project p WHERE p.status = :status AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.fullDescription) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Project> searchPublicProjects(@Param("query") String query, @Param("status") ContentStatus status);
}
