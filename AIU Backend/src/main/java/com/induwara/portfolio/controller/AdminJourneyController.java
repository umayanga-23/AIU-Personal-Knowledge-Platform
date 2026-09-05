package com.induwara.portfolio.controller;

import com.induwara.portfolio.dto.ApiResponse;
import com.induwara.portfolio.dto.JourneyRequest;
import com.induwara.portfolio.dto.JourneyResponse;
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
@RequestMapping("/api/admin/journey")
@RequiredArgsConstructor
@Tag(name = "Admin Learning Journey", description = "Admin CRUD for learning journey timeline")
@SecurityRequirement(name = "bearerAuth")
public class AdminJourneyController {

    private final AdminPortfolioService adminService;

    @PostMapping
    @Operation(summary = "Create a learning journey entry")
    public ResponseEntity<ApiResponse<JourneyResponse>> createJourney(@Valid @RequestBody JourneyRequest.CreateOrUpdate req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Learning journey entry created successfully", adminService.createJourney(req)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a learning journey entry")
    public ResponseEntity<ApiResponse<JourneyResponse>> updateJourney(
            @PathVariable UUID id,
            @Valid @RequestBody JourneyRequest.CreateOrUpdate req) {
        return ResponseEntity.ok(ApiResponse.success("Learning journey entry updated successfully", adminService.updateJourney(id, req)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a learning journey entry")
    public ResponseEntity<ApiResponse<Void>> deleteJourney(@PathVariable UUID id) {
        adminService.deleteJourney(id);
        return ResponseEntity.ok(ApiResponse.success("Learning journey entry deleted successfully"));
    }
}
