package com.induwara.portfolio.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResponse {
    private String query;
    private List<ProjectResponse> projects;
    private List<ResearchResponse> research;
    private List<ArticleResponse> articles;
    private List<TechnologyResponse> technologies;
    private List<VideoResponse> videos;
}
