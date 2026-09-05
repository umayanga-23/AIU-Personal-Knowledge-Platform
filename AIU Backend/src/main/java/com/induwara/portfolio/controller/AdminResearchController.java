package com.induwara.portfolio.controller;

import com.induwara.portfolio.dto.ApiResponse;
import com.induwara.portfolio.dto.ResearchRequest;
import com.induwara.portfolio.dto.ResearchResponse;
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
@RequestMapping("/api/admin/research")
@RequiredArgsConstructor
@Tag(name = "Admin Research", description = "Admin CRUD and publishing management for research papers")
@SecurityRequirement(name = "bearerAuth")
public class AdminResearchController {

    private final AdminPortfolioService adminService;

    @PostMapping
    @Operation(summary = "Create a new research paper")
    public ResponseEntity<ApiResponse<ResearchResponse>> createResearch(@Valid @RequestBody ResearchRequest.CreateOrUpdate req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Research paper created successfully", adminService.createResearch(req)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing research paper")
    public ResponseEntity<ApiResponse<ResearchResponse>> updateResearch(
            @PathVariable UUID id,
            @Valid @RequestBody ResearchRequest.CreateOrUpdate req) {
        return ResponseEntity.ok(ApiResponse.success("Research paper updated successfully", adminService.updateResearch(id, req)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a research paper")
    public ResponseEntity<ApiResponse<Void>> deleteResearch(@PathVariable UUID id) {
        adminService.deleteResearch(id);
        return ResponseEntity.ok(ApiResponse.success("Research paper deleted successfully"));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publish a research paper")
    public ResponseEntity<ApiResponse<ResearchResponse>> publishResearch(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Research paper published successfully", adminService.publishResearch(id)));
    }

    @PatchMapping("/{id}/unpublish")
    @Operation(summary = "Unpublish a research paper")
    public ResponseEntity<ApiResponse<ResearchResponse>> unpublishResearch(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Research paper unpublished successfully", adminService.unpublishResearch(id)));
    }
}
