package com.induwara.portfolio.repository;

import com.induwara.portfolio.entity.Video;
import com.induwara.portfolio.enums.ContentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VideoRepository extends JpaRepository<Video, UUID> {
    Page<Video> findByStatus(ContentStatus status, Pageable pageable);
    Page<Video> findByStatusAndFeatured(ContentStatus status, Boolean featured, Pageable pageable);

    @Query("SELECT v FROM Video v WHERE v.status = :status AND " +
           "(LOWER(v.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Video> searchPublicVideos(@Param("query") String query, @Param("status") ContentStatus status);
}
