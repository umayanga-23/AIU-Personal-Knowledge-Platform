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
public class ResearchResponse {
    private UUID id;
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
    private Set<TechnologyResponse> technologies;
    private Set<TagResponse> tags;
    private Set<ArticleResponse> articles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
