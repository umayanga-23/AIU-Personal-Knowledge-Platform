package com.induwara.portfolio.service;

import com.induwara.portfolio.dto.CvResponse;
import com.induwara.portfolio.entity.CvDocument;
import com.induwara.portfolio.enums.ContentStatus;
import com.induwara.portfolio.exception.BadRequestException;
import com.induwara.portfolio.exception.ResourceNotFoundException;
import com.induwara.portfolio.repository.CvDocumentRepository;
import com.induwara.portfolio.service.storage.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CvManagementService {

    private static final String CV_BUCKET = "cv-files";
    private static final List<String> ALLOWED_CV_TYPES = List.of("application/pdf");

    private final CvDocumentRepository cvRepository;
    private final SupabaseStorageService storageService;
    private final EntityMapper mapper;

    @Transactional(readOnly = true)
    public Optional<CvResponse> findCurrentPublicCv() {
        return cvRepository.findByStatusAndIsCurrentTrue(ContentStatus.PUBLIC)
                .map(cv -> mapper.toCvResponse(cv, "/api/public/cv/download"));
    }

    @Transactional(readOnly = true)
    public CvResponse getCurrentPublicCv() {
        return findCurrentPublicCv()
                .orElseThrow(() -> new ResourceNotFoundException("No current public CV found."));
    }

    @Transactional(readOnly = true)
    public byte[] downloadCurrentPublicCvBytes() {
        CvDocument cv = cvRepository.findByStatusAndIsCurrentTrue(ContentStatus.PUBLIC)
                .orElseThrow(() -> new ResourceNotFoundException("No current public CV available for download."));

        return storageService.downloadFileBytes(CV_BUCKET, cv.getFileUrl());
    }

    @Transactional(readOnly = true)
    public List<CvResponse> getAllCvs() {
        return cvRepository.findAllByOrderByUploadedAtDesc().stream()
                .map(cv -> {
                    String signedUrl = storageService.createSignedUrl(CV_BUCKET, cv.getFileUrl(), 3600);
                    return mapper.toCvResponse(cv, signedUrl);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CvResponse getCvById(UUID id) {
        CvDocument cv = cvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CV document not found with ID: " + id));

        String signedUrl = storageService.createSignedUrl(CV_BUCKET, cv.getFileUrl(), 3600);
        return mapper.toCvResponse(cv, signedUrl);
    }

    @Transactional
    public CvResponse uploadCv(MultipartFile file, String title, String version, Boolean isCurrent, ContentStatus status) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("CV file is required.");
        }

        String storedPath = storageService.uploadFile(CV_BUCKET, file, ALLOWED_CV_TYPES);

        boolean currentFlag = Boolean.TRUE.equals(isCurrent);
        ContentStatus finalStatus = status != null ? status : ContentStatus.PRIVATE;

        CvDocument cv = CvDocument.builder()
                .title(title != null ? title : file.getOriginalFilename())
                .fileName(file.getOriginalFilename())
                .fileUrl(storedPath)
                .version(version != null ? version : "1.0")
                .status(finalStatus)
                .isCurrent(currentFlag)
                .uploadedAt(LocalDateTime.now())
                .publishedAt(finalStatus == ContentStatus.PUBLIC ? LocalDateTime.now() : null)
                .build();

        CvDocument saved = cvRepository.save(cv);

        if (currentFlag) {
            cvRepository.resetOtherCurrentFlags(saved.getId());
        }

        String signedUrl = storageService.createSignedUrl(CV_BUCKET, saved.getFileUrl(), 3600);
        return mapper.toCvResponse(saved, signedUrl);
    }

    @Transactional
    public CvResponse replaceCv(UUID id, MultipartFile file, String title, String version) {
        CvDocument cv = cvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CV document not found with ID: " + id));

        if (file != null && !file.isEmpty()) {
            // Delete old file from storage
            storageService.deleteFile(CV_BUCKET, cv.getFileUrl());
            // Upload new file
            String newPath = storageService.uploadFile(CV_BUCKET, file, ALLOWED_CV_TYPES);
            cv.setFileUrl(newPath);
            cv.setFileName(file.getOriginalFilename());
        }

        if (title != null) cv.setTitle(title);
        if (version != null) cv.setVersion(version);
        cv.setUploadedAt(LocalDateTime.now());

        CvDocument updated = cvRepository.save(cv);
        String signedUrl = storageService.createSignedUrl(CV_BUCKET, updated.getFileUrl(), 3600);
        return mapper.toCvResponse(updated, signedUrl);
    }

    @Transactional
    public CvResponse publishCv(UUID id) {
        CvDocument cv = cvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CV document not found with ID: " + id));

        cv.setStatus(ContentStatus.PUBLIC);
        cv.setPublishedAt(LocalDateTime.now());
        cv.setIsCurrent(true);

        CvDocument saved = cvRepository.save(cv);
        cvRepository.resetOtherCurrentFlags(saved.getId());

        String signedUrl = storageService.createSignedUrl(CV_BUCKET, saved.getFileUrl(), 3600);
        return mapper.toCvResponse(saved, signedUrl);
    }

    @Transactional
    public CvResponse unpublishCv(UUID id) {
        CvDocument cv = cvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CV document not found with ID: " + id));

        cv.setStatus(ContentStatus.PRIVATE);
        CvDocument saved = cvRepository.save(cv);

        String signedUrl = storageService.createSignedUrl(CV_BUCKET, saved.getFileUrl(), 3600);
        return mapper.toCvResponse(saved, signedUrl);
    }

    @Transactional
    public CvResponse makeCvCurrent(UUID id) {
        CvDocument cv = cvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CV document not found with ID: " + id));

        cv.setIsCurrent(true);
        CvDocument saved = cvRepository.save(cv);
        cvRepository.resetOtherCurrentFlags(saved.getId());

        String signedUrl = storageService.createSignedUrl(CV_BUCKET, saved.getFileUrl(), 3600);
        return mapper.toCvResponse(saved, signedUrl);
    }

    @Transactional
    public void deleteCv(UUID id) {
        CvDocument cv = cvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CV document not found with ID: " + id));

        storageService.deleteFile(CV_BUCKET, cv.getFileUrl());
        cvRepository.delete(cv);
    }

    @Transactional(readOnly = true)
    public byte[] downloadCvBytesById(UUID id) {
        CvDocument cv = cvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CV document not found with ID: " + id));

        return storageService.downloadFileBytes(CV_BUCKET, cv.getFileUrl());
    }

    @Transactional(readOnly = true)
    public CvDocument getCvEntityById(UUID id) {
        return cvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CV document not found with ID: " + id));
    }
}
