package com.HealthConnect.Jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;

import java.util.*;

@Component
public class JwtTokenProvider {
//    @Value("jwt.secret")
    private String SECRET_KEY = "thisisaverysecurejwtsecretkeythatshouldbeatleast32bytes";
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY))).build().parseSignedClaims(token).getPayload();
    }

    public String genarateTokens(String username) {
        Map<String, Objects> claims = new HashMap<>();
        return Jwts.builder()
                .header()
                .keyId(UUID.randomUUID().toString())
                .and()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY)))
                .compact();
    }
    public String resolveToken(HttpServletRequest http) {
        String bearerToken = http.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
    public String getUserFromJWT(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }
}
