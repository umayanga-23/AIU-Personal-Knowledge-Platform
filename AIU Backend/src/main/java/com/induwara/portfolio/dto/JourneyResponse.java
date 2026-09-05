package com.induwara.portfolio.dto;

import com.induwara.portfolio.enums.ContentStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JourneyResponse {
    private UUID id;
    private String title;
    private String description;
    private LocalDateTime journeyDate;
    private ContentStatus status;
    private Set<TechnologyResponse> technologies;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
