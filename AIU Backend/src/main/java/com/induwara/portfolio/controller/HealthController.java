package com.induwara.portfolio.controller;

import com.induwara.portfolio.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "System health check endpoint")
public class HealthController {

    @GetMapping
    @Operation(summary = "Check backend application status")
    public ResponseEntity<ApiResponse<Void>> checkHealth() {
        return ResponseEntity.ok(ApiResponse.success("Portfolio backend is running"));
    }
}
