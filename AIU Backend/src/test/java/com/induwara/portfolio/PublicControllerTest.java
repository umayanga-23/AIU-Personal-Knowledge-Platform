package com.induwara.portfolio;

import com.induwara.portfolio.entity.*;
import com.induwara.portfolio.enums.ContentStatus;
import com.induwara.portfolio.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@SuppressWarnings("null")
class PublicControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ResearchRepository researchRepository;

    @Autowired
    private KnowledgeArticleRepository articleRepository;

    @Autowired
    private CvDocumentRepository cvRepository;

    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
        researchRepository.deleteAll();
        articleRepository.deleteAll();
        cvRepository.deleteAll();

        // Create Public Project
        Project publicProject = Project.builder()
                .title("Public Distributed System")
                .slug("public-distributed-system")
                .shortDescription("High performance system")
                .fullDescription("Full detailed description")
                .status(ContentStatus.PUBLIC)
                .featured(true)
                .build();
        projectRepository.save(publicProject);

        // Create Draft Project (should not be returned in public API)
        Project draftProject = Project.builder()
                .title("Draft Internal Secret Project")
                .slug("draft-secret-project")
                .status(ContentStatus.DRAFT)
                .build();
        projectRepository.save(draftProject);

        // Create Public Research
        Research publicResearch = Research.builder()
                .title("Consensus Algorithms in Edge Computing")
                .slug("consensus-algorithms-edge")
                .abstractText("Abstract research details")
                .status(ContentStatus.PUBLIC)
                .build();
        researchRepository.save(publicResearch);

        // Create Public Knowledge Article
        KnowledgeArticle publicArticle = KnowledgeArticle.builder()
                .title("Understanding Spring Boot 3 Security Filters")
                .slug("understanding-spring-security")
                .content("In depth guide to security filters")
                .status(ContentStatus.PUBLIC)
                .build();
        articleRepository.save(publicArticle);

        // Create Current Public CV
        CvDocument publicCv = CvDocument.builder()
                .title("Induwara Resume 2026")
                .fileName("induwara_cv.pdf")
                .fileUrl("cv-files/induwara_cv.pdf")
                .version("2.0")
                .status(ContentStatus.PUBLIC)
                .isCurrent(true)
                .uploadedAt(LocalDateTime.now())
                .publishedAt(LocalDateTime.now())
                .build();
        cvRepository.save(publicCv);
    }

    @Test
    void testGetPublicProjects() throws Exception {
        mockMvc.perform(get("/api/public/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content.length()").value(1))
                .andExpect(jsonPath("$.data.content[0].slug").value("public-distributed-system"));
    }

    @Test
    void testGetPublicProjectBySlugSuccess() throws Exception {
        mockMvc.perform(get("/api/public/projects/public-distributed-system"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Public Distributed System"));
    }

    @Test
    void testGetPublicProjectBySlugNotFound() throws Exception {
        mockMvc.perform(get("/api/public/projects/non-existent-slug"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testDraftProjectNotExposedInPublicApi() throws Exception {
        mockMvc.perform(get("/api/public/projects/draft-secret-project"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetPublicResearch() throws Exception {
        mockMvc.perform(get("/api/public/research"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].slug").value("consensus-algorithms-edge"));
    }

    @Test
    void testGetPublicArticles() throws Exception {
        mockMvc.perform(get("/api/public/articles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].slug").value("understanding-spring-security"));
    }

    @Test
    void testGetPublicCv() throws Exception {
        mockMvc.perform(get("/api/public/cv"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.version").value("2.0"))
                .andExpect(jsonPath("$.data.isCurrent").value(true));
    }

    @Test
    void testHealthCheck() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Portfolio backend is running"));
    }
}
