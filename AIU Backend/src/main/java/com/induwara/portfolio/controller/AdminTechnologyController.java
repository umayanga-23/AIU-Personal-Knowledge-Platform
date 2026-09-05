package com.induwara.portfolio.controller;

import com.induwara.portfolio.dto.ApiResponse;
import com.induwara.portfolio.dto.TechnologyRequest;
import com.induwara.portfolio.dto.TechnologyResponse;
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
@RequestMapping("/api/admin/technologies")
@RequiredArgsConstructor
@Tag(name = "Admin Technologies", description = "Admin CRUD for technologies")
@SecurityRequirement(name = "bearerAuth")
public class AdminTechnologyController {

    private final AdminPortfolioService adminService;

    @PostMapping
    @Operation(summary = "Create a technology record")
    public ResponseEntity<ApiResponse<TechnologyResponse>> createTechnology(@Valid @RequestBody TechnologyRequest.CreateOrUpdate req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Technology created successfully", adminService.createTechnology(req)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a technology record")
    public ResponseEntity<ApiResponse<TechnologyResponse>> updateTechnology(
            @PathVariable UUID id,
            @Valid @RequestBody TechnologyRequest.CreateOrUpdate req) {
        return ResponseEntity.ok(ApiResponse.success("Technology updated successfully", adminService.updateTechnology(id, req)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a technology record")
    public ResponseEntity<ApiResponse<Void>> deleteTechnology(@PathVariable UUID id) {
        adminService.deleteTechnology(id);
        return ResponseEntity.ok(ApiResponse.success("Technology deleted successfully"));
    }
}
