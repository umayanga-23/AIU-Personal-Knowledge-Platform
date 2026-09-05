package com.induwara.portfolio.service;

import com.induwara.portfolio.dto.*;
import com.induwara.portfolio.entity.*;
import com.induwara.portfolio.enums.ContentStatus;
import com.induwara.portfolio.exception.ResourceNotFoundException;
import com.induwara.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicPortfolioService {

    private final ProjectRepository projectRepository;
    private final ResearchRepository researchRepository;
    private final KnowledgeArticleRepository articleRepository;
    private final TechnologyRepository technologyRepository;
    private final VideoRepository videoRepository;
    private final LearningJourneyRepository journeyRepository;
    private final CvManagementService cvManagementService;
    private final EntityMapper mapper;

    public PagedResponse<ProjectResponse> getPublicProjects(Boolean featured, String techSlug, String tagSlug,
                                                           int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Project> projectPage = projectRepository.findPublicProjectsFiltered(
                ContentStatus.PUBLIC, featured, techSlug, tagSlug, pageable);
        return PagedResponse.fromPage(projectPage.map(mapper::toProjectResponse));
    }

    public ProjectResponse getPublicProjectBySlug(String slug) {
        Project project = projectRepository.findBySlugAndStatus(slug, ContentStatus.PUBLIC)
                .orElseThrow(() -> new ResourceNotFoundException("Public project not found with slug: " + slug));
        return mapper.toProjectResponse(project);
    }

    public PagedResponse<ResearchResponse> getPublicResearch(Boolean featured, String techSlug, String tagSlug,
                                                             int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Research> researchPage = researchRepository.findPublicResearchFiltered(
                ContentStatus.PUBLIC, featured, techSlug, tagSlug, pageable);
        return PagedResponse.fromPage(researchPage.map(mapper::toResearchResponse));
    }

    public ResearchResponse getPublicResearchBySlug(String slug) {
        Research research = researchRepository.findBySlugAndStatus(slug, ContentStatus.PUBLIC)
                .orElseThrow(() -> new ResourceNotFoundException("Public research not found with slug: " + slug));
        return mapper.toResearchResponse(research);
    }

    public PagedResponse<TechnologyResponse> getPublicTechnologies(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Technology> techPage = technologyRepository.findByStatus(ContentStatus.PUBLIC, pageable);
        return PagedResponse.fromPage(techPage.map(mapper::toTechnologyResponse));
    }

    public TechnologyResponse getPublicTechnologyBySlug(String slug) {
        Technology tech = technologyRepository.findBySlugAndStatus(slug, ContentStatus.PUBLIC)
                .orElseThrow(() -> new ResourceNotFoundException("Public technology not found with slug: " + slug));
        return mapper.toTechnologyResponse(tech);
    }

    public PagedResponse<ArticleResponse> getPublicArticles(Boolean featured, String techSlug, String tagSlug,
                                                           int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<KnowledgeArticle> articlePage = articleRepository.findPublicArticlesFiltered(
                ContentStatus.PUBLIC, featured, techSlug, tagSlug, pageable);
        return PagedResponse.fromPage(articlePage.map(mapper::toArticleResponse));
    }

    public ArticleResponse getPublicArticleBySlug(String slug) {
        KnowledgeArticle article = articleRepository.findBySlugAndStatus(slug, ContentStatus.PUBLIC)
                .orElseThrow(() -> new ResourceNotFoundException("Public article not found with slug: " + slug));
        return mapper.toArticleResponse(article);
    }

    public PagedResponse<VideoResponse> getPublicVideos(Boolean featured, int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<Video> videoPage;
        if (Boolean.TRUE.equals(featured)) {
            videoPage = videoRepository.findByStatusAndFeatured(ContentStatus.PUBLIC, true, pageable);
        } else {
            videoPage = videoRepository.findByStatus(ContentStatus.PUBLIC, pageable);
        }
        return PagedResponse.fromPage(videoPage.map(mapper::toVideoResponse));
    }

    public PagedResponse<JourneyResponse> getPublicJourney(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = createPageable(page, size, sortBy, sortDir);
        Page<LearningJourney> journeyPage = journeyRepository.findByStatus(ContentStatus.PUBLIC, pageable);
        return PagedResponse.fromPage(journeyPage.map(mapper::toJourneyResponse));
    }

    public AboutResponse getAboutInfo() {
        List<TechnologyResponse> topTechs = technologyRepository.findByStatus(ContentStatus.PUBLIC)
                .stream()
                .limit(10)
                .map(mapper::toTechnologyResponse)
                .collect(Collectors.toList());

        CvResponse cv = cvManagementService.findCurrentPublicCv().orElse(null);

        return AboutResponse.builder()
                .name("Induwara")
                .title("Senior Software Architect & Full Stack Engineer")
                .bio("Passionate software architect, researcher, and open-source enthusiast dedicated to building scalable backend systems and robust cloud architectures.")
                .location("Colombo, Sri Lanka")
                .highlights(List.of(
                        "Experienced in Java, Spring Boot, Microservices, and PostgreSQL",
                        "Active research in distributed systems and software engineering",
                        "Creator of technical articles and YouTube knowledge sharing content"
                ))
                .topTechnologies(topTechs)
                .currentCv(cv)
                .build();
    }

    public ContactResponse getContactInfo() {
        return ContactResponse.builder()
                .email("induwara.dev@example.com")
                .githubUrl("https://github.com/induwara")
                .linkedinUrl("https://linkedin.com/in/induwara")
                .twitterUrl("https://twitter.com/induwara")
                .youtubeUrl("https://youtube.com/@induwara")
                .build();
    }

    public SearchResponse globalSearch(String query) {
        if (query == null || query.trim().length() < 2) {
            return SearchResponse.builder()
                    .query(query)
                    .projects(Collections.emptyList())
                    .research(Collections.emptyList())
                    .articles(Collections.emptyList())
                    .technologies(Collections.emptyList())
                    .videos(Collections.emptyList())
                    .build();
        }

        String q = query.trim();
        List<ProjectResponse> projects = projectRepository.searchPublicProjects(q, ContentStatus.PUBLIC)
                .stream().map(mapper::toProjectResponse).collect(Collectors.toList());

        List<ResearchResponse> research = researchRepository.searchPublicResearch(q, ContentStatus.PUBLIC)
                .stream().map(mapper::toResearchResponse).collect(Collectors.toList());

        List<ArticleResponse> articles = articleRepository.searchPublicArticles(q, ContentStatus.PUBLIC)
                .stream().map(mapper::toArticleResponse).collect(Collectors.toList());

        List<TechnologyResponse> techs = technologyRepository.searchPublicTechnologies(q, ContentStatus.PUBLIC)
                .stream().map(mapper::toTechnologyResponse).collect(Collectors.toList());

        List<VideoResponse> videos = videoRepository.searchPublicVideos(q, ContentStatus.PUBLIC)
                .stream().map(mapper::toVideoResponse).collect(Collectors.toList());

        return SearchResponse.builder()
                .query(q)
                .projects(projects)
                .research(research)
                .articles(articles)
                .technologies(techs)
                .videos(videos)
                .build();
    }

    private Pageable createPageable(int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir != null ? sortDir : "DESC"),
                sortBy != null ? sortBy : "createdAt");
        return PageRequest.of(Math.max(0, page), Math.max(1, Math.min(100, size)), sort);
    }
}
