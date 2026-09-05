package com.induwara.portfolio.service;

import com.induwara.portfolio.dto.*;
import com.induwara.portfolio.entity.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class EntityMapper {

    public TagResponse toTagResponse(Tag tag) {
        if (tag == null) return null;
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .slug(tag.getSlug())
                .build();
    }

    public TechnologyResponse toTechnologyResponse(Technology tech) {
        if (tech == null) return null;
        return TechnologyResponse.builder()
                .id(tech.getId())
                .name(tech.getName())
                .slug(tech.getSlug())
                .description(tech.getDescription())
                .category(tech.getCategory())
                .iconUrl(tech.getIconUrl())
                .websiteUrl(tech.getWebsiteUrl())
                .status(tech.getStatus())
                .createdAt(tech.getCreatedAt())
                .updatedAt(tech.getUpdatedAt())
                .build();
    }

    public VideoResponse toVideoResponse(Video video) {
        if (video == null) return null;
        return VideoResponse.builder()
                .id(video.getId())
                .title(video.getTitle())
                .description(video.getDescription())
                .youtubeUrl(video.getYoutubeUrl())
                .youtubeVideoId(video.getYoutubeVideoId())
                .thumbnailUrl(video.getThumbnailUrl())
                .publishedDate(video.getPublishedDate())
                .featured(video.getFeatured())
                .status(video.getStatus())
                .createdAt(video.getCreatedAt())
                .updatedAt(video.getUpdatedAt())
                .build();
    }

    public JourneyResponse toJourneyResponse(LearningJourney journey) {
        if (journey == null) return null;
        Set<TechnologyResponse> techs = journey.getTechnologies() != null ?
                journey.getTechnologies().stream().map(this::toTechnologyResponse).collect(Collectors.toSet()) : Collections.emptySet();

        return JourneyResponse.builder()
                .id(journey.getId())
                .title(journey.getTitle())
                .description(journey.getDescription())
                .journeyDate(journey.getJourneyDate())
                .status(journey.getStatus())
                .technologies(techs)
                .createdAt(journey.getCreatedAt())
                .updatedAt(journey.getUpdatedAt())
                .build();
    }

    public ArticleResponse toArticleResponse(KnowledgeArticle article) {
        if (article == null) return null;
        Set<TechnologyResponse> techs = article.getTechnologies() != null ?
                article.getTechnologies().stream().map(this::toTechnologyResponse).collect(Collectors.toSet()) : Collections.emptySet();
        Set<TagResponse> tags = article.getTags() != null ?
                article.getTags().stream().map(this::toTagResponse).collect(Collectors.toSet()) : Collections.emptySet();

        return ArticleResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .slug(article.getSlug())
                .excerpt(article.getExcerpt())
                .content(article.getContent())
                .coverImage(article.getCoverImage())
                .readingTime(article.getReadingTime())
                .featured(article.getFeatured())
                .status(article.getStatus())
                .publishedDate(article.getPublishedDate())
                .technologies(techs)
                .tags(tags)
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }

    public ResearchResponse toResearchResponse(Research research) {
        if (research == null) return null;
        Set<TechnologyResponse> techs = research.getTechnologies() != null ?
                research.getTechnologies().stream().map(this::toTechnologyResponse).collect(Collectors.toSet()) : Collections.emptySet();
        Set<TagResponse> tags = research.getTags() != null ?
                research.getTags().stream().map(this::toTagResponse).collect(Collectors.toSet()) : Collections.emptySet();
        Set<ArticleResponse> articles = research.getArticles() != null ?
                research.getArticles().stream().map(this::toArticleResponse).collect(Collectors.toSet()) : Collections.emptySet();

        return ResearchResponse.builder()
                .id(research.getId())
                .title(research.getTitle())
                .slug(research.getSlug())
                .abstractText(research.getAbstractText())
                .introduction(research.getIntroduction())
                .methodology(research.getMethodology())
                .results(research.getResults())
                .conclusion(research.getConclusion())
                .authors(research.getAuthors())
                .publicationDate(research.getPublicationDate())
                .publicationUrl(research.getPublicationUrl())
                .pdfUrl(research.getPdfUrl())
                .featured(research.getFeatured())
                .status(research.getStatus())
                .publishedDate(research.getPublishedDate())
                .technologies(techs)
                .tags(tags)
                .articles(articles)
                .createdAt(research.getCreatedAt())
                .updatedAt(research.getUpdatedAt())
                .build();
    }

    public ProjectResponse toProjectResponse(Project project) {
        if (project == null) return null;
        Set<TechnologyResponse> techs = project.getTechnologies() != null ?
                project.getTechnologies().stream().map(this::toTechnologyResponse).collect(Collectors.toSet()) : Collections.emptySet();
        Set<TagResponse> tags = project.getTags() != null ?
                project.getTags().stream().map(this::toTagResponse).collect(Collectors.toSet()) : Collections.emptySet();
        Set<VideoResponse> videos = project.getVideos() != null ?
                project.getVideos().stream().map(this::toVideoResponse).collect(Collectors.toSet()) : Collections.emptySet();
        Set<ResearchResponse> researchList = project.getResearchList() != null ?
                project.getResearchList().stream().map(this::toResearchResponse).collect(Collectors.toSet()) : Collections.emptySet();
        Set<ArticleResponse> articles = project.getArticles() != null ?
                project.getArticles().stream().map(this::toArticleResponse).collect(Collectors.toSet()) : Collections.emptySet();

        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .slug(project.getSlug())
                .shortDescription(project.getShortDescription())
                .fullDescription(project.getFullDescription())
                .problem(project.getProblem())
                .solution(project.getSolution())
                .features(project.getFeatures())
                .myContribution(project.getMyContribution())
                .thumbnail(project.getThumbnail())
                .videoId(project.getVideoId())
                .githubUrl(project.getGithubUrl())
                .liveDemoUrl(project.getLiveDemoUrl())
                .documentationUrl(project.getDocumentationUrl())
                .featured(project.getFeatured())
                .status(project.getStatus())
                .publishedDate(project.getPublishedDate())
                .technologies(techs)
                .tags(tags)
                .videos(videos)
                .researchList(researchList)
                .articles(articles)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    public CvResponse toCvResponse(CvDocument cv, String downloadUrl) {
        if (cv == null) return null;
        return CvResponse.builder()
                .id(cv.getId())
                .title(cv.getTitle())
                .fileName(cv.getFileName())
                .fileUrl(cv.getFileUrl())
                .downloadUrl(downloadUrl)
                .version(cv.getVersion())
                .status(cv.getStatus())
                .isCurrent(cv.getIsCurrent())
                .uploadedAt(cv.getUploadedAt())
                .publishedAt(cv.getPublishedAt())
                .createdAt(cv.getCreatedAt())
                .updatedAt(cv.getUpdatedAt())
                .build();
    }
}
