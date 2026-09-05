package com.induwara.portfolio.repository;

import com.induwara.portfolio.entity.Research;
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
public interface ResearchRepository extends JpaRepository<Research, UUID> {

    Optional<Research> findBySlug(String slug);
    Optional<Research> findBySlugAndStatus(String slug, ContentStatus status);

    Page<Research> findByStatus(ContentStatus status, Pageable pageable);

    @Query("SELECT DISTINCT r FROM Research r " +
           "LEFT JOIN r.technologies tech " +
           "LEFT JOIN r.tags tag " +
           "WHERE r.status = :status " +
           "AND (CAST(:featured AS boolean) IS NULL OR r.featured = :featured) " +
           "AND (CAST(:techSlug AS string) IS NULL OR tech.slug = :techSlug) " +
           "AND (CAST(:tagSlug AS string) IS NULL OR tag.slug = :tagSlug)")
    Page<Research> findPublicResearchFiltered(
            @Param("status") ContentStatus status,
            @Param("featured") Boolean featured,
            @Param("techSlug") String techSlug,
            @Param("tagSlug") String tagSlug,
            Pageable pageable
    );

    @Query("SELECT r FROM Research r WHERE r.status = :status AND " +
           "(LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.abstractText) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.introduction) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Research> searchPublicResearch(@Param("query") String query, @Param("status") ContentStatus status);
}
