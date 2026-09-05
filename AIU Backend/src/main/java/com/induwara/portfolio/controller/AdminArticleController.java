package com.induwara.portfolio.controller;

import com.induwara.portfolio.dto.ApiResponse;
import com.induwara.portfolio.dto.ArticleRequest;
import com.induwara.portfolio.dto.ArticleResponse;
import com.induwara.portfolio.service.AdminPortfolioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/articles")
@RequiredArgsConstructor
@Tag(name = "Admin Knowledge Articles", description = "Admin CRUD and publishing management for technical articles")
@SecurityRequirement(name = "bearerAuth")
public class AdminArticleController {

    private final AdminPortfolioService adminService;

    @PostMapping
    @Operation(summary = "Create a knowledge article")
    public ResponseEntity<ApiResponse<ArticleResponse>> createArticle(@Valid @RequestBody ArticleRequest.CreateOrUpdate req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Article created successfully", adminService.createArticle(req)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a knowledge article")
    public ResponseEntity<ApiResponse<ArticleResponse>> updateArticle(
            @PathVariable UUID id,
            @Valid @RequestBody ArticleRequest.CreateOrUpdate req) {
        return ResponseEntity.ok(ApiResponse.success("Article updated successfully", adminService.updateArticle(id, req)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a knowledge article")
    public ResponseEntity<ApiResponse<Void>> deleteArticle(@PathVariable UUID id) {
        adminService.deleteArticle(id);
        return ResponseEntity.ok(ApiResponse.success("Article deleted successfully"));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publish an article")
    public ResponseEntity<ApiResponse<ArticleResponse>> publishArticle(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Article published successfully", adminService.publishArticle(id)));
    }

    @PatchMapping("/{id}/unpublish")
    @Operation(summary = "Unpublish an article")
    public ResponseEntity<ApiResponse<ArticleResponse>> unpublishArticle(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Article unpublished successfully", adminService.unpublishArticle(id)));
    }
}
