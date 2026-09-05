package com.induwara.portfolio.controller;

import com.induwara.portfolio.dto.ApiResponse;
import com.induwara.portfolio.dto.VideoRequest;
import com.induwara.portfolio.dto.VideoResponse;
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
@RequestMapping("/api/admin/videos")
@RequiredArgsConstructor
@Tag(name = "Admin YouTube Videos", description = "Admin CRUD for YouTube project videos")
@SecurityRequirement(name = "bearerAuth")
public class AdminVideoController {

    private final AdminPortfolioService adminService;

    @PostMapping
    @Operation(summary = "Create a new YouTube video entry")
    public ResponseEntity<ApiResponse<VideoResponse>> createVideo(@Valid @RequestBody VideoRequest.CreateOrUpdate req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Video created successfully", adminService.createVideo(req)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a YouTube video entry")
    public ResponseEntity<ApiResponse<VideoResponse>> updateVideo(
            @PathVariable UUID id,
            @Valid @RequestBody VideoRequest.CreateOrUpdate req) {
        return ResponseEntity.ok(ApiResponse.success("Video updated successfully", adminService.updateVideo(id, req)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a YouTube video entry")
    public ResponseEntity<ApiResponse<Void>> deleteVideo(@PathVariable UUID id) {
        adminService.deleteVideo(id);
        return ResponseEntity.ok(ApiResponse.success("Video deleted successfully"));
    }
}
