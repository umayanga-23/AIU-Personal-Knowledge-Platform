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
public class ArticleResponse {
    private UUID id;
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String coverImage;
    private Integer readingTime;
    private Boolean featured;
    private ContentStatus status;
    private LocalDateTime publishedDate;
    private Set<TechnologyResponse> technologies;
    private Set<TagResponse> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
