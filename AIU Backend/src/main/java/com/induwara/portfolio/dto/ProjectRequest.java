package com.induwara.portfolio.dto;

import com.induwara.portfolio.enums.ContentStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public class ProjectRequest {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateOrUpdate {
        @NotBlank(message = "Project title is required")
        private String title;

        private String slug;
        private String shortDescription;
        private String fullDescription;
        private String problem;
        private String solution;
        private String features;
        private String myContribution;
        private String thumbnail;
        private String videoId;
        private String githubUrl;
        private String liveDemoUrl;
        private String documentationUrl;
        private Boolean featured;
        private ContentStatus status;
        private LocalDateTime publishedDate;
        private Set<UUID> technologyIds;
        private Set<UUID> tagIds;
        private Set<UUID> videoIds;
        private Set<UUID> researchIds;
        private Set<UUID> articleIds;
    }
}
