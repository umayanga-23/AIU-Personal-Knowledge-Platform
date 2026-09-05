package com.induwara.portfolio.dto;

import com.induwara.portfolio.enums.ContentStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public class ResearchRequest {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateOrUpdate {
        @NotBlank(message = "Title is required")
        private String title;

        private String slug;
        private String abstractText;
        private String introduction;
        private String methodology;
        private String results;
        private String conclusion;
        private String authors;
        private LocalDateTime publicationDate;
        private String publicationUrl;
        private String pdfUrl;
        private Boolean featured;
        private ContentStatus status;
        private LocalDateTime publishedDate;
        private Set<UUID> technologyIds;
        private Set<UUID> tagIds;
        private Set<UUID> articleIds;
    }
}
