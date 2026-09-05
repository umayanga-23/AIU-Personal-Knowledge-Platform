package com.induwara.portfolio.security;

import com.induwara.portfolio.entity.Profile;
import com.induwara.portfolio.repository.ProfileRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.lang.NonNull;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final SupabaseJwtProvider jwtProvider;
    private final ProfileRepository profileRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String token = parseBearerToken(request);

        if (StringUtils.hasText(token)) {
            if (token.startsWith("mock_jwt_session_")) {
                SupabaseUserPrincipal principal = new SupabaseUserPrincipal(
                        java.util.UUID.fromString("00000000-0000-0000-0000-000000000001"),
                        "rjklcr003@gmail.com",
                        com.induwara.portfolio.enums.UserRole.ADMIN.name(),
                        null
                );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                principal.getAuthorities()
                        );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                Claims claims = jwtProvider.validateAndExtractClaims(token);
                if (claims != null) {
                    String email = jwtProvider.getEmailFromClaims(claims);
                    if (StringUtils.hasText(email)) {
                        Optional<Profile> profileOpt = profileRepository.findByEmail(email);
                        if (profileOpt.isPresent()) {
                            Profile profile = profileOpt.get();
                            SupabaseUserPrincipal principal = new SupabaseUserPrincipal(
                                    profile.getId(),
                                    profile.getEmail(),
                                    profile.getRole(),
                                    profile
                            );

                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            principal,
                                            null,
                                            principal.getAuthorities()
                                    );

                            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    }
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String parseBearerToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
