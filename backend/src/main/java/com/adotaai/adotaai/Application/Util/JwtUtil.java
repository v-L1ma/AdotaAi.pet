package com.adotaai.adotaai.Application.Util;

import java.util.Base64;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.adotaai.adotaai.Domain.Entity.Roles;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${jwt.refresh-expiration:604800000}")
    private Long refreshExpiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email, UUID id, Roles cargo) {
        return buildToken(email, id, cargo, expiration, "access");
    }

    public String generateRefreshToken(String email, UUID id, Roles cargo) {
        return buildToken(email, id, cargo, refreshExpiration, "refresh");
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public UUID extractUserId(String token) {
        Object id = extractAllClaims(token).get("id");
        if (id == null) {
            throw new RuntimeException("Token sem claim de id.");
        }
        return UUID.fromString(id.toString());
    }

    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public boolean validateToken(String token, String email) {
        return extractEmail(token).equals(email) && !isTokenExpired(token);
    }

    public boolean validateRefreshToken(String token, String email) {
        return validateToken(token, email) && "refresh".equals(extractTokenType(token));
    }

    public Roles extractCargo(String token) {
        Object cargo = extractAllClaims(token).get("cargo");
        if (cargo == null) {
            return null;
        }
        try {
            return Roles.valueOf(cargo.toString());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private String buildToken(String email, UUID id, Roles cargo, Long expirationMs, String tokenType) {
        return Jwts.builder()
                .subject(email)
                .claim("id", id)
                .claim("cargo", cargo)
                .claim("type", tokenType)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    private String extractTokenType(String token) {
        Object type = extractAllClaims(token).get("type");
        return type != null ? type.toString() : "";
    }
}
