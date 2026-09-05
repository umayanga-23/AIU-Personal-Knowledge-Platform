package com.induwara.portfolio.dto;

import com.induwara.portfolio.enums.ContentStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoResponse {
    private UUID id;
    private String title;
    private String description;
    private String youtubeUrl;
    private String youtubeVideoId;
    private String thumbnailUrl;
    private LocalDateTime publishedDate;
    private Boolean featured;
    private ContentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
