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
public class ProjectResponse {
    private UUID id;
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
    private Set<TechnologyResponse> technologies;
    private Set<TagResponse> tags;
    private Set<VideoResponse> videos;
    private Set<ResearchResponse> researchList;
    private Set<ArticleResponse> articles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
