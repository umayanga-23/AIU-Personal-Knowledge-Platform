package com.induwara.portfolio.dto;

import com.induwara.portfolio.enums.ContentStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public class ArticleRequest {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateOrUpdate {
        @NotBlank(message = "Title is required")
        private String title;

        private String slug;
        private String excerpt;

        @NotBlank(message = "Content is required")
        private String content;

        private String coverImage;
        private Integer readingTime;
        private Boolean featured;
        private ContentStatus status;
        private LocalDateTime publishedDate;
        private Set<UUID> technologyIds;
        private Set<UUID> tagIds;
    }
}
