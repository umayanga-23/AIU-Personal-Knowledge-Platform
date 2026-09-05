package com.induwara.portfolio.controller;

import com.induwara.portfolio.dto.ApiResponse;
import com.induwara.portfolio.dto.CvResponse;
import com.induwara.portfolio.entity.CvDocument;
import com.induwara.portfolio.enums.ContentStatus;
import com.induwara.portfolio.service.CvManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/cv")
@RequiredArgsConstructor
@Tag(name = "Admin CV Management", description = "Admin CRUD, upload, replacement, publishing, and download management for CV documents")
@SecurityRequirement(name = "bearerAuth")
@SuppressWarnings("null")
public class AdminCvController {

    private final CvManagementService cvService;

    @GetMapping
    @Operation(summary = "Get list of all CV documents")
    public ResponseEntity<ApiResponse<List<CvResponse>>> getAllCvs() {
        return ResponseEntity.ok(ApiResponse.success(cvService.getAllCvs()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get CV details by ID")
    public ResponseEntity<ApiResponse<CvResponse>> getCvById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(cvService.getCvById(id)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a new CV document (PDF)")
    public ResponseEntity<ApiResponse<CvResponse>> uploadCv(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "version", required = false) String version,
            @RequestParam(value = "isCurrent", required = false, defaultValue = "false") Boolean isCurrent,
            @RequestParam(value = "status", required = false, defaultValue = "PRIVATE") ContentStatus status) {

        CvResponse cv = cvService.uploadCv(file, title, version, isCurrent, status);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("CV document uploaded successfully", cv));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Replace an existing CV file or update metadata")
    public ResponseEntity<ApiResponse<CvResponse>> replaceCv(
            @PathVariable UUID id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "version", required = false) String version) {

        CvResponse cv = cvService.replaceCv(id, file, title, version);
        return ResponseEntity.ok(ApiResponse.success("CV document updated successfully", cv));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publish a CV document (status = PUBLIC, isCurrent = true)")
    public ResponseEntity<ApiResponse<CvResponse>> publishCv(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("CV published successfully", cvService.publishCv(id)));
    }

    @PatchMapping("/{id}/unpublish")
    @Operation(summary = "Unpublish a CV document (status = PRIVATE)")
    public ResponseEntity<ApiResponse<CvResponse>> unpublishCv(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("CV unpublished successfully", cvService.unpublishCv(id)));
    }

    @PatchMapping("/{id}/current")
    @Operation(summary = "Set a CV document as current active version")
    public ResponseEntity<ApiResponse<CvResponse>> makeCvCurrent(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("CV set as current active version", cvService.makeCvCurrent(id)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a CV document and its storage file")
    public ResponseEntity<ApiResponse<Void>> deleteCv(@PathVariable UUID id) {
        cvService.deleteCv(id);
        return ResponseEntity.ok(ApiResponse.success("CV deleted successfully"));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download a specific CV document file")
    public ResponseEntity<byte[]> downloadCv(@PathVariable UUID id) {
        CvDocument cv = cvService.getCvEntityById(id);
        byte[] bytes = cvService.downloadCvBytesById(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.builder("attachment")
                                .filename(cv.getFileName() != null ? cv.getFileName() : "CV.pdf")
                                .build().toString())
                .body(bytes);
    }
}
