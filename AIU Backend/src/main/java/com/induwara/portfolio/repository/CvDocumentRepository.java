package com.induwara.portfolio.repository;

import com.induwara.portfolio.entity.CvDocument;
import com.induwara.portfolio.enums.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CvDocumentRepository extends JpaRepository<CvDocument, UUID> {
    Optional<CvDocument> findByStatusAndIsCurrentTrue(ContentStatus status);
    Optional<CvDocument> findByIsCurrentTrue();
    List<CvDocument> findAllByOrderByUploadedAtDesc();

    @Modifying
    @Query("UPDATE CvDocument c SET c.isCurrent = false WHERE c.id != :activeId")
    void resetOtherCurrentFlags(@Param("activeId") UUID activeId);

    @Modifying
    @Query("UPDATE CvDocument c SET c.isCurrent = false")
    void resetAllCurrentFlags();
}
