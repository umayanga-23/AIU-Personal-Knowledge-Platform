package com.induwara.portfolio.repository;

import com.induwara.portfolio.entity.KnowledgeArticle;
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
public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, UUID> {

    Optional<KnowledgeArticle> findBySlug(String slug);
    Optional<KnowledgeArticle> findBySlugAndStatus(String slug, ContentStatus status);

    Page<KnowledgeArticle> findByStatus(ContentStatus status, Pageable pageable);

    @Query("SELECT DISTINCT a FROM KnowledgeArticle a " +
           "LEFT JOIN a.technologies tech " +
           "LEFT JOIN a.tags tag " +
           "WHERE a.status = :status " +
           "AND (CAST(:featured AS boolean) IS NULL OR a.featured = :featured) " +
           "AND (CAST(:techSlug AS string) IS NULL OR tech.slug = :techSlug) " +
           "AND (CAST(:tagSlug AS string) IS NULL OR tag.slug = :tagSlug)")
    Page<KnowledgeArticle> findPublicArticlesFiltered(
            @Param("status") ContentStatus status,
            @Param("featured") Boolean featured,
            @Param("techSlug") String techSlug,
            @Param("tagSlug") String tagSlug,
            Pageable pageable
    );

    @Query("SELECT a FROM KnowledgeArticle a WHERE a.status = :status AND " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.excerpt) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<KnowledgeArticle> searchPublicArticles(@Param("query") String query, @Param("status") ContentStatus status);
}
