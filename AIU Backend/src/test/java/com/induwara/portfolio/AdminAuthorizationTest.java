package com.induwara.portfolio;

import com.induwara.portfolio.entity.Profile;
import com.induwara.portfolio.repository.ProfileRepository;
import com.induwara.portfolio.security.SupabaseJwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@SuppressWarnings("null")
class AdminAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProfileRepository profileRepository;

    @MockBean
    private SupabaseJwtProvider jwtProvider;

    @BeforeEach
    void setUp() {
        profileRepository.deleteAll();
    }

    @Test
    void testUnauthenticatedUserRejectedWith401() throws Exception {
        mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Test\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testNonAdminUserForbiddenWith403() throws Exception {
        // Create non-admin profile
        Profile userProfile = Profile.builder()
                .id(UUID.randomUUID())
                .email("user@example.com")
                .role("USER")
                .build();
        profileRepository.save(userProfile);

        // Mock JWT claims returning user email
        io.jsonwebtoken.Claims mockClaims = Mockito.mock(io.jsonwebtoken.Claims.class);
        Mockito.when(jwtProvider.validateAndExtractClaims("valid-user-token")).thenReturn(mockClaims);
        Mockito.when(jwtProvider.getEmailFromClaims(mockClaims)).thenReturn("user@example.com");

        mockMvc.perform(post("/api/admin/projects")
                        .header("Authorization", "Bearer valid-user-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Test\"}"))
                .andExpect(status().isForbidden());
    }
}
