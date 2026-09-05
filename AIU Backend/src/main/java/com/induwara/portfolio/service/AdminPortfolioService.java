package com.induwara.portfolio.service;

import com.induwara.portfolio.dto.*;
import com.induwara.portfolio.entity.*;
import com.induwara.portfolio.enums.ContentStatus;
import com.induwara.portfolio.exception.BadRequestException;
import com.induwara.portfolio.exception.ResourceNotFoundException;
import com.induwara.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class AdminPortfolioService {

    private final ProjectRepository projectRepository;
    private final ResearchRepository researchRepository;
    private final KnowledgeArticleRepository articleRepository;
    private final TechnologyRepository technologyRepository;
    private final VideoRepository videoRepository;
    private final LearningJourneyRepository journeyRepository;
    private final TagRepository tagRepository;
    private final EntityMapper mapper;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    // --- Projects ---

    public ProjectResponse createProject(ProjectRequest.CreateOrUpdate req) {
        String slug = generateOrValidateSlug(req.getSlug(), req.getTitle());
        if (projectRepository.findBySlug(slug).isPresent()) {
            throw new BadRequestException("Project slug already exists: " + slug);
        }

        Project project = Project.builder()
                .title(req.getTitle())
                .slug(slug)
                .shortDescription(req.getShortDescription())
                .fullDescription(req.getFullDescription())
                .problem(req.getProblem())
                .solution(req.getSolution())
                .features(req.getFeatures())
                .myContribution(req.getMyContribution())
                .thumbnail(req.getThumbnail())
                .videoId(req.getVideoId())
                .githubUrl(req.getGithubUrl())
                .liveDemoUrl(req.getLiveDemoUrl())
                .documentationUrl(req.getDocumentationUrl())
                .featured(Boolean.TRUE.equals(req.getFeatured()))
                .status(req.getStatus() != null ? req.getStatus() : ContentStatus.DRAFT)
                .publishedDate(req.getStatus() == ContentStatus.PUBLIC ? LocalDateTime.now() : req.getPublishedDate())
                .technologies(fetchTechnologies(req.getTechnologyIds()))
                .tags(fetchTags(req.getTagIds()))
                .videos(fetchVideos(req.getVideoIds()))
                .researchList(fetchResearch(req.getResearchIds()))
                .articles(fetchArticles(req.getArticleIds()))
                .build();

        return mapper.toProjectResponse(projectRepository.save(project));
    }

    public ProjectResponse updateProject(UUID id, ProjectRequest.CreateOrUpdate req) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));

        if (StringUtils.hasText(req.getSlug()) && !req.getSlug().equals(project.getSlug())) {
            String newSlug = generateOrValidateSlug(req.getSlug(), req.getTitle());
            if (projectRepository.findBySlug(newSlug).isPresent()) {
                throw new BadRequestException("Project slug already exists: " + newSlug);
            }
            project.setSlug(newSlug);
        }

        project.setTitle(req.getTitle());
        project.setShortDescription(req.getShortDescription());
        project.setFullDescription(req.getFullDescription());
        project.setProblem(req.getProblem());
        project.setSolution(req.getSolution());
        project.setFeatures(req.getFeatures());
        project.setMyContribution(req.getMyContribution());
        project.setThumbnail(req.getThumbnail());
        project.setVideoId(req.getVideoId());
        project.setGithubUrl(req.getGithubUrl());
        project.setLiveDemoUrl(req.getLiveDemoUrl());
        project.setDocumentationUrl(req.getDocumentationUrl());
        if (req.getFeatured() != null) project.setFeatured(req.getFeatured());
        if (req.getStatus() != null) project.setStatus(req.getStatus());
        if (req.getPublishedDate() != null) project.setPublishedDate(req.getPublishedDate());

        if (req.getTechnologyIds() != null) project.setTechnologies(fetchTechnologies(req.getTechnologyIds()));
        if (req.getTagIds() != null) project.setTags(fetchTags(req.getTagIds()));
        if (req.getVideoIds() != null) project.setVideos(fetchVideos(req.getVideoIds()));
        if (req.getResearchIds() != null) project.setResearchList(fetchResearch(req.getResearchIds()));
        if (req.getArticleIds() != null) project.setArticles(fetchArticles(req.getArticleIds()));

        return mapper.toProjectResponse(projectRepository.save(project));
    }

    public void deleteProject(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));
        projectRepository.delete(project);
    }

    public ProjectResponse publishProject(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));
        project.setStatus(ContentStatus.PUBLIC);
        project.setPublishedDate(LocalDateTime.now());
        return mapper.toProjectResponse(projectRepository.save(project));
    }

    public ProjectResponse unpublishProject(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));
        project.setStatus(ContentStatus.PRIVATE);
        return mapper.toProjectResponse(projectRepository.save(project));
    }

    // --- Research ---

    public ResearchResponse createResearch(ResearchRequest.CreateOrUpdate req) {
        String slug = generateOrValidateSlug(req.getSlug(), req.getTitle());
        if (researchRepository.findBySlug(slug).isPresent()) {
            throw new BadRequestException("Research slug already exists: " + slug);
        }

        Research research = Research.builder()
                .title(req.getTitle())
                .slug(slug)
                .abstractText(req.getAbstractText())
                .introduction(req.getIntroduction())
                .methodology(req.getMethodology())
                .results(req.getResults())
                .conclusion(req.getConclusion())
                .authors(req.getAuthors())
                .publicationDate(req.getPublicationDate())
                .publicationUrl(req.getPublicationUrl())
                .pdfUrl(req.getPdfUrl())
                .featured(Boolean.TRUE.equals(req.getFeatured()))
                .status(req.getStatus() != null ? req.getStatus() : ContentStatus.DRAFT)
                .publishedDate(req.getStatus() == ContentStatus.PUBLIC ? LocalDateTime.now() : req.getPublishedDate())
                .technologies(fetchTechnologies(req.getTechnologyIds()))
                .tags(fetchTags(req.getTagIds()))
                .articles(fetchArticles(req.getArticleIds()))
                .build();

        return mapper.toResearchResponse(researchRepository.save(research));
    }

    public ResearchResponse updateResearch(UUID id, ResearchRequest.CreateOrUpdate req) {
        Research research = researchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Research not found with ID: " + id));

        if (StringUtils.hasText(req.getSlug()) && !req.getSlug().equals(research.getSlug())) {
            String newSlug = generateOrValidateSlug(req.getSlug(), req.getTitle());
            if (researchRepository.findBySlug(newSlug).isPresent()) {
                throw new BadRequestException("Research slug already exists: " + newSlug);
            }
            research.setSlug(newSlug);
        }

        research.setTitle(req.getTitle());
        research.setAbstractText(req.getAbstractText());
        research.setIntroduction(req.getIntroduction());
        research.setMethodology(req.getMethodology());
        research.setResults(req.getResults());
        research.setConclusion(req.getConclusion());
        research.setAuthors(req.getAuthors());
        research.setPublicationDate(req.getPublicationDate());
        research.setPublicationUrl(req.getPublicationUrl());
        research.setPdfUrl(req.getPdfUrl());
        if (req.getFeatured() != null) research.setFeatured(req.getFeatured());
        if (req.getStatus() != null) research.setStatus(req.getStatus());
        if (req.getPublishedDate() != null) research.setPublishedDate(req.getPublishedDate());

        if (req.getTechnologyIds() != null) research.setTechnologies(fetchTechnologies(req.getTechnologyIds()));
        if (req.getTagIds() != null) research.setTags(fetchTags(req.getTagIds()));
        if (req.getArticleIds() != null) research.setArticles(fetchArticles(req.getArticleIds()));

        return mapper.toResearchResponse(researchRepository.save(research));
    }

    public void deleteResearch(UUID id) {
        Research research = researchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Research not found with ID: " + id));
        researchRepository.delete(research);
    }

    public ResearchResponse publishResearch(UUID id) {
        Research research = researchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Research not found with ID: " + id));
        research.setStatus(ContentStatus.PUBLIC);
        research.setPublishedDate(LocalDateTime.now());
        return mapper.toResearchResponse(researchRepository.save(research));
    }

    public ResearchResponse unpublishResearch(UUID id) {
        Research research = researchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Research not found with ID: " + id));
        research.setStatus(ContentStatus.PRIVATE);
        return mapper.toResearchResponse(researchRepository.save(research));
    }

    // --- Technologies ---

    public TechnologyResponse createTechnology(TechnologyRequest.CreateOrUpdate req) {
        String slug = generateOrValidateSlug(req.getSlug(), req.getName());
        if (technologyRepository.findBySlug(slug).isPresent()) {
            throw new BadRequestException("Technology slug already exists: " + slug);
        }

        Technology tech = Technology.builder()
                .name(req.getName())
                .slug(slug)
                .description(req.getDescription())
                .category(req.getCategory())
                .iconUrl(req.getIconUrl())
                .websiteUrl(req.getWebsiteUrl())
                .status(req.getStatus() != null ? req.getStatus() : ContentStatus.PUBLIC)
                .build();

        return mapper.toTechnologyResponse(technologyRepository.save(tech));
    }

    public TechnologyResponse updateTechnology(UUID id, TechnologyRequest.CreateOrUpdate req) {
        Technology tech = technologyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technology not found with ID: " + id));

        tech.setName(req.getName());
        if (StringUtils.hasText(req.getSlug()) && !req.getSlug().equals(tech.getSlug())) {
            String newSlug = generateOrValidateSlug(req.getSlug(), req.getName());
            tech.setSlug(newSlug);
        }
        tech.setDescription(req.getDescription());
        tech.setCategory(req.getCategory());
        tech.setIconUrl(req.getIconUrl());
        tech.setWebsiteUrl(req.getWebsiteUrl());
        if (req.getStatus() != null) tech.setStatus(req.getStatus());

        return mapper.toTechnologyResponse(technologyRepository.save(tech));
    }

    public void deleteTechnology(UUID id) {
        Technology tech = technologyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technology not found with ID: " + id));
        technologyRepository.delete(tech);
    }

    // --- Articles ---

    public ArticleResponse createArticle(ArticleRequest.CreateOrUpdate req) {
        String slug = generateOrValidateSlug(req.getSlug(), req.getTitle());
        if (articleRepository.findBySlug(slug).isPresent()) {
            throw new BadRequestException("Article slug already exists: " + slug);
        }

        KnowledgeArticle article = KnowledgeArticle.builder()
                .title(req.getTitle())
                .slug(slug)
                .excerpt(req.getExcerpt())
                .content(req.getContent())
                .coverImage(req.getCoverImage())
                .readingTime(req.getReadingTime() != null ? req.getReadingTime() : calculateReadingTime(req.getContent()))
                .featured(Boolean.TRUE.equals(req.getFeatured()))
                .status(req.getStatus() != null ? req.getStatus() : ContentStatus.DRAFT)
                .publishedDate(req.getStatus() == ContentStatus.PUBLIC ? LocalDateTime.now() : req.getPublishedDate())
                .technologies(fetchTechnologies(req.getTechnologyIds()))
                .tags(fetchTags(req.getTagIds()))
                .build();

        return mapper.toArticleResponse(articleRepository.save(article));
    }

    public ArticleResponse updateArticle(UUID id, ArticleRequest.CreateOrUpdate req) {
        KnowledgeArticle article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with ID: " + id));

        if (StringUtils.hasText(req.getSlug()) && !req.getSlug().equals(article.getSlug())) {
            String newSlug = generateOrValidateSlug(req.getSlug(), req.getTitle());
            if (articleRepository.findBySlug(newSlug).isPresent()) {
                throw new BadRequestException("Article slug already exists: " + newSlug);
            }
            article.setSlug(newSlug);
        }

        article.setTitle(req.getTitle());
        article.setExcerpt(req.getExcerpt());
        article.setContent(req.getContent());
        article.setCoverImage(req.getCoverImage());
        article.setReadingTime(req.getReadingTime() != null ? req.getReadingTime() : calculateReadingTime(req.getContent()));
        if (req.getFeatured() != null) article.setFeatured(req.getFeatured());
        if (req.getStatus() != null) article.setStatus(req.getStatus());
        if (req.getPublishedDate() != null) article.setPublishedDate(req.getPublishedDate());

        if (req.getTechnologyIds() != null) article.setTechnologies(fetchTechnologies(req.getTechnologyIds()));
        if (req.getTagIds() != null) article.setTags(fetchTags(req.getTagIds()));

        return mapper.toArticleResponse(articleRepository.save(article));
    }

    public void deleteArticle(UUID id) {
        KnowledgeArticle article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with ID: " + id));
        articleRepository.delete(article);
    }

    public ArticleResponse publishArticle(UUID id) {
        KnowledgeArticle article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with ID: " + id));
        article.setStatus(ContentStatus.PUBLIC);
        article.setPublishedDate(LocalDateTime.now());
        return mapper.toArticleResponse(articleRepository.save(article));
    }

    public ArticleResponse unpublishArticle(UUID id) {
        KnowledgeArticle article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with ID: " + id));
        article.setStatus(ContentStatus.PRIVATE);
        return mapper.toArticleResponse(articleRepository.save(article));
    }

    // --- Videos ---

    public VideoResponse createVideo(VideoRequest.CreateOrUpdate req) {
        Video video = Video.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .youtubeUrl(req.getYoutubeUrl())
                .youtubeVideoId(req.getYoutubeVideoId() != null ? req.getYoutubeVideoId() : extractYoutubeId(req.getYoutubeUrl()))
                .thumbnailUrl(req.getThumbnailUrl())
                .publishedDate(req.getPublishedDate() != null ? req.getPublishedDate() : LocalDateTime.now())
                .featured(Boolean.TRUE.equals(req.getFeatured()))
                .status(req.getStatus() != null ? req.getStatus() : ContentStatus.PUBLIC)
                .build();

        return mapper.toVideoResponse(videoRepository.save(video));
    }

    public VideoResponse updateVideo(UUID id, VideoRequest.CreateOrUpdate req) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with ID: " + id));

        video.setTitle(req.getTitle());
        video.setDescription(req.getDescription());
        video.setYoutubeUrl(req.getYoutubeUrl());
        video.setYoutubeVideoId(req.getYoutubeVideoId() != null ? req.getYoutubeVideoId() : extractYoutubeId(req.getYoutubeUrl()));
        video.setThumbnailUrl(req.getThumbnailUrl());
        if (req.getPublishedDate() != null) video.setPublishedDate(req.getPublishedDate());
        if (req.getFeatured() != null) video.setFeatured(req.getFeatured());
        if (req.getStatus() != null) video.setStatus(req.getStatus());

        return mapper.toVideoResponse(videoRepository.save(video));
    }

    public void deleteVideo(UUID id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with ID: " + id));
        videoRepository.delete(video);
    }

    // --- Learning Journey ---

    public JourneyResponse createJourney(JourneyRequest.CreateOrUpdate req) {
        LearningJourney journey = LearningJourney.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .journeyDate(req.getJourneyDate() != null ? req.getJourneyDate() : LocalDateTime.now())
                .status(req.getStatus() != null ? req.getStatus() : ContentStatus.PUBLIC)
                .technologies(fetchTechnologies(req.getTechnologyIds()))
                .build();

        return mapper.toJourneyResponse(journeyRepository.save(journey));
    }

    public JourneyResponse updateJourney(UUID id, JourneyRequest.CreateOrUpdate req) {
        LearningJourney journey = journeyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning Journey entry not found with ID: " + id));

        journey.setTitle(req.getTitle());
        journey.setDescription(req.getDescription());
        if (req.getJourneyDate() != null) journey.setJourneyDate(req.getJourneyDate());
        if (req.getStatus() != null) journey.setStatus(req.getStatus());
        if (req.getTechnologyIds() != null) journey.setTechnologies(fetchTechnologies(req.getTechnologyIds()));

        return mapper.toJourneyResponse(journeyRepository.save(journey));
    }

    public void deleteJourney(UUID id) {
        LearningJourney journey = journeyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning Journey entry not found with ID: " + id));
        journeyRepository.delete(journey);
    }

    // --- Helpers ---

    private Set<Technology> fetchTechnologies(Set<UUID> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        return new HashSet<>(technologyRepository.findAllById(ids));
    }

    private Set<Tag> fetchTags(Set<UUID> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        return new HashSet<>(tagRepository.findAllById(ids));
    }

    private Set<Video> fetchVideos(Set<UUID> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        return new HashSet<>(videoRepository.findAllById(ids));
    }

    private Set<Research> fetchResearch(Set<UUID> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        return new HashSet<>(researchRepository.findAllById(ids));
    }

    private Set<KnowledgeArticle> fetchArticles(Set<UUID> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        return new HashSet<>(articleRepository.findAllById(ids));
    }

    private String generateOrValidateSlug(String providedSlug, String fallbackTitle) {
        String base = StringUtils.hasText(providedSlug) ? providedSlug : fallbackTitle;
        if (!StringUtils.hasText(base)) {
            return UUID.randomUUID().toString();
        }
        String nowhitespace = WHITESPACE.matcher(base).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }

    private int calculateReadingTime(String content) {
        if (!StringUtils.hasText(content)) return 1;
        int words = content.trim().split("\\s+").length;
        return Math.max(1, (int) Math.ceil(words / 200.0));
    }

    private String extractYoutubeId(String url) {
        if (!StringUtils.hasText(url)) return null;
        if (url.contains("v=")) {
            String[] parts = url.split("v=");
            if (parts.length > 1) {
                String idPart = parts[1];
                int ampIndex = idPart.indexOf('&');
                return ampIndex != -1 ? idPart.substring(0, ampIndex) : idPart;
            }
        } else if (url.contains("youtu.be/")) {
            String[] parts = url.split("youtu.be/");
            if (parts.length > 1) {
                String idPart = parts[1];
                int qIndex = idPart.indexOf('?');
                return qIndex != -1 ? idPart.substring(0, qIndex) : idPart;
            }
        }
        return null;
    }
}
