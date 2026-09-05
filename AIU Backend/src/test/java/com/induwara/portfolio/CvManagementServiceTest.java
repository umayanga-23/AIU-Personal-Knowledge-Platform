package com.induwara.portfolio;

import com.induwara.portfolio.dto.CvResponse;
import com.induwara.portfolio.entity.CvDocument;
import com.induwara.portfolio.enums.ContentStatus;
import com.induwara.portfolio.repository.CvDocumentRepository;
import com.induwara.portfolio.service.CvManagementService;
import com.induwara.portfolio.service.storage.SupabaseStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

@SpringBootTest
@ActiveProfiles("test")
@SuppressWarnings("null")
class CvManagementServiceTest {

    @Autowired
    private CvManagementService cvService;

    @Autowired
    private CvDocumentRepository cvRepository;

    @MockBean
    private SupabaseStorageService storageService;

    @BeforeEach
    void setUp() {
        cvRepository.deleteAll();
        Mockito.when(storageService.uploadFile(eq("cv-files"), any(), any()))
                .thenReturn("cv-files/mock-uuid.pdf");
        Mockito.when(storageService.createSignedUrl(eq("cv-files"), any(), any(Integer.class)))
                .thenReturn("https://supabase.co/storage/v1/object/sign/cv-files/mock-uuid.pdf?token=abc");
    }

    @Test
    void testUploadCvAndCurrentVersionToggle() {
        MockMultipartFile file1 = new MockMultipartFile("file", "cv1.pdf", "application/pdf", "PDF Content 1".getBytes());
        MockMultipartFile file2 = new MockMultipartFile("file", "cv2.pdf", "application/pdf", "PDF Content 2".getBytes());

        // Upload first CV as current
        CvResponse cv1 = cvService.uploadCv(file1, "CV Version 1", "1.0", true, ContentStatus.PUBLIC);
        assertTrue(cv1.getIsCurrent());

        // Upload second CV as current
        CvResponse cv2 = cvService.uploadCv(file2, "CV Version 2", "2.0", true, ContentStatus.PUBLIC);
        assertTrue(cv2.getIsCurrent());

        // Verify first CV is no longer current
        CvDocument fetchedCv1 = cvRepository.findById(cv1.getId()).orElseThrow();
        assertFalse(fetchedCv1.getIsCurrent());

        // Verify second CV is current
        CvDocument fetchedCv2 = cvRepository.findById(cv2.getId()).orElseThrow();
        assertTrue(fetchedCv2.getIsCurrent());
    }

    @Test
    void testPublishCvSetsIsCurrentTrue() {
        MockMultipartFile file = new MockMultipartFile("file", "cv_draft.pdf", "application/pdf", "PDF Content".getBytes());
        CvResponse draftCv = cvService.uploadCv(file, "Draft CV", "1.0", false, ContentStatus.PRIVATE);
        assertFalse(draftCv.getIsCurrent());
        assertEquals(ContentStatus.PRIVATE, draftCv.getStatus());

        // Publish CV
        CvResponse publishedCv = cvService.publishCv(draftCv.getId());
        assertEquals(ContentStatus.PUBLIC, publishedCv.getStatus());
        assertTrue(publishedCv.getIsCurrent());
    }
}
