package com.induwara.portfolio.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class SupabaseJwtProvider {

    private static final Logger logger = LoggerFactory.getLogger(SupabaseJwtProvider.class);

    @Value("${supabase.jwt-secret}")
    private String jwtSecret;

    public Claims validateAndExtractClaims(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            logger.warn("JWT validation failed: {}", e.getMessage());
            return null;
        }
    }

    public String getEmailFromClaims(Claims claims) {
        if (claims == null) return null;
        String email = claims.get("email", String.class);
        if (email == null) {
            email = claims.getSubject();
        }
        return email;
    }
}
