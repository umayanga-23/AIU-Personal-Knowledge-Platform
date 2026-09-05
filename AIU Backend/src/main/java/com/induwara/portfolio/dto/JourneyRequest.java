package com.induwara.portfolio.dto;

import com.induwara.portfolio.enums.ContentStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public class JourneyRequest {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateOrUpdate {
        @NotBlank(message = "Title is required")
        private String title;

        private String description;
        private LocalDateTime journeyDate;
        private ContentStatus status;
        private Set<UUID> technologyIds;
    }
}
