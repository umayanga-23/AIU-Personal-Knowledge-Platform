package com.induwara.portfolio.repository;

import com.induwara.portfolio.entity.LearningJourney;
import com.induwara.portfolio.enums.ContentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LearningJourneyRepository extends JpaRepository<LearningJourney, UUID> {
    Page<LearningJourney> findByStatus(ContentStatus status, Pageable pageable);
}
