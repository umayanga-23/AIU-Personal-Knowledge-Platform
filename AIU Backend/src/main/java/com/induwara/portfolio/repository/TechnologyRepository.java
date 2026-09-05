package com.induwara.portfolio.repository;

import com.induwara.portfolio.entity.Technology;
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
public interface TechnologyRepository extends JpaRepository<Technology, UUID> {
    Optional<Technology> findBySlug(String slug);
    Optional<Technology> findBySlugAndStatus(String slug, ContentStatus status);
    Page<Technology> findByStatus(ContentStatus status, Pageable pageable);
    List<Technology> findByStatus(ContentStatus status);

    @Query("SELECT t FROM Technology t WHERE t.status = :status AND " +
           "(LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Technology> searchPublicTechnologies(@Param("query") String query, @Param("status") ContentStatus status);
}
