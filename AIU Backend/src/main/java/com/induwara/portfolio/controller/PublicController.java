package com.induwara.portfolio.controller;

import com.induwara.portfolio.dto.*;
import com.induwara.portfolio.service.CvManagementService;
import com.induwara.portfolio.service.PublicPortfolioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Tag(name = "Public APIs", description = "Public read-only portfolio, research, knowledge, and CV endpoints")
@SuppressWarnings("null")
public class PublicController {

    private final PublicPortfolioService publicService;
    private final CvManagementService cvManagementService;

    // --- Projects ---

    @GetMapping("/projects")
    @Operation(summary = "Get paginated list of public projects")
    public ResponseEntity<ApiResponse<PagedResponse<ProjectResponse>>> getProjects(
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String technology,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        return ResponseEntity.ok(ApiResponse.success(
                publicService.getPublicProjects(featured, technology, tag, page, size, sortBy, sortDir)));
    }

    @GetMapping("/projects/{slug}")
    @Operation(summary = "Get public project details by slug")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(publicService.getPublicProjectBySlug(slug)));
    }

    // --- Research ---

    @GetMapping("/research")
    @Operation(summary = "Get paginated list of public research papers")
    public ResponseEntity<ApiResponse<PagedResponse<ResearchResponse>>> getResearch(
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String technology,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        return ResponseEntity.ok(ApiResponse.success(
                publicService.getPublicResearch(featured, technology, tag, page, size, sortBy, sortDir)));
    }

    @GetMapping("/research/{slug}")
    @Operation(summary = "Get public research details by slug")
    public ResponseEntity<ApiResponse<ResearchResponse>> getResearchBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(publicService.getPublicResearchBySlug(slug)));
    }

    // --- Technologies ---

    @GetMapping("/technologies")
    @Operation(summary = "Get paginated list of public technologies")
    public ResponseEntity<ApiResponse<PagedResponse<TechnologyResponse>>> getTechnologies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {
        return ResponseEntity.ok(ApiResponse.success(
                publicService.getPublicTechnologies(page, size, sortBy, sortDir)));
    }

    @GetMapping("/technologies/{slug}")
    @Operation(summary = "Get public technology details by slug")
    public ResponseEntity<ApiResponse<TechnologyResponse>> getTechnologyBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(publicService.getPublicTechnologyBySlug(slug)));
    }

    // --- Knowledge Articles ---

    @GetMapping("/articles")
    @Operation(summary = "Get paginated list of public knowledge articles")
    public ResponseEntity<ApiResponse<PagedResponse<ArticleResponse>>> getArticles(
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String technology,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publishedDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        return ResponseEntity.ok(ApiResponse.success(
                publicService.getPublicArticles(featured, technology, tag, page, size, sortBy, sortDir)));
    }

    @GetMapping("/articles/{slug}")
    @Operation(summary = "Get public knowledge article details by slug")
    public ResponseEntity<ApiResponse<ArticleResponse>> getArticleBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(publicService.getPublicArticleBySlug(slug)));
    }

    // --- Videos ---

    @GetMapping("/videos")
    @Operation(summary = "Get paginated list of public videos")
    public ResponseEntity<ApiResponse<PagedResponse<VideoResponse>>> getVideos(
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publishedDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        return ResponseEntity.ok(ApiResponse.success(
                publicService.getPublicVideos(featured, page, size, sortBy, sortDir)));
    }

    // --- Learning Journey ---

    @GetMapping("/journey")
    @Operation(summary = "Get paginated list of public learning journey entries")
    public ResponseEntity<ApiResponse<PagedResponse<JourneyResponse>>> getJourney(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "journeyDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        return ResponseEntity.ok(ApiResponse.success(
                publicService.getPublicJourney(page, size, sortBy, sortDir)));
    }

    // --- CV ---

    @GetMapping("/cv")
    @Operation(summary = "Get current public CV details and signed download URL")
    public ResponseEntity<ApiResponse<CvResponse>> getCurrentCv() {
        return ResponseEntity.ok(ApiResponse.success(cvManagementService.getCurrentPublicCv()));
    }

    @GetMapping("/cv/download")
    @Operation(summary = "Download current public CV document")
    public ResponseEntity<byte[]> downloadCurrentCv() {
        CvResponse cv = cvManagementService.getCurrentPublicCv();
        byte[] bytes = cvManagementService.downloadCurrentPublicCvBytes();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.builder("inline")
                                .filename(cv.getFileName() != null ? cv.getFileName() : "CV.pdf")
                                .build().toString())
                .body(bytes);
    }

    // --- About & Contact ---

    @GetMapping("/about")
    @Operation(summary = "Get public about me portfolio overview")
    public ResponseEntity<ApiResponse<AboutResponse>> getAboutInfo() {
        return ResponseEntity.ok(ApiResponse.success(publicService.getAboutInfo()));
    }

    @GetMapping("/contact")
    @Operation(summary = "Get public contact links and email")
    public ResponseEntity<ApiResponse<ContactResponse>> getContactInfo() {
        return ResponseEntity.ok(ApiResponse.success(publicService.getContactInfo()));
    }

    // --- Global Search ---

    @GetMapping("/search")
    @Operation(summary = "Search across public projects, research, articles, tech, and videos")
    public ResponseEntity<ApiResponse<SearchResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success(publicService.globalSearch(q)));
    }
}
