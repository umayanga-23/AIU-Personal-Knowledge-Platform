package com.induwara.portfolio.dto;

import com.induwara.portfolio.enums.ContentStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

public class VideoRequest {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateOrUpdate {
        @NotBlank(message = "Title is required")
        private String title;

        private String description;

        @NotBlank(message = "YouTube URL is required")
        private String youtubeUrl;

        private String youtubeVideoId;
        private String thumbnailUrl;
        private LocalDateTime publishedDate;
        private Boolean featured;
        private ContentStatus status;
    }
}
