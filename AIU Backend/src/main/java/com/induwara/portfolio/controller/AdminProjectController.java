package com.induwara.portfolio.controller;

import com.induwara.portfolio.dto.ApiResponse;
import com.induwara.portfolio.dto.ProjectRequest;
import com.induwara.portfolio.dto.ProjectResponse;
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
@RequestMapping("/api/admin/projects")
@RequiredArgsConstructor
@Tag(name = "Admin Projects", description = "Admin CRUD and publishing management for projects")
@SecurityRequirement(name = "bearerAuth")
public class AdminProjectController {

    private final AdminPortfolioService adminService;

    @PostMapping
    @Operation(summary = "Create a new project")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(@Valid @RequestBody ProjectRequest.CreateOrUpdate req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created successfully", adminService.createProject(req)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing project")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable UUID id,
            @Valid @RequestBody ProjectRequest.CreateOrUpdate req) {
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", adminService.updateProject(id, req)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable UUID id) {
        adminService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully"));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publish a project")
    public ResponseEntity<ApiResponse<ProjectResponse>> publishProject(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Project published successfully", adminService.publishProject(id)));
    }

    @PatchMapping("/{id}/unpublish")
    @Operation(summary = "Unpublish a project")
    public ResponseEntity<ApiResponse<ProjectResponse>> unpublishProject(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Project unpublished successfully", adminService.unpublishProject(id)));
    }
}
