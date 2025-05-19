package com.HealthConnect.Service;

import com.HealthConnect.Dto.MeetingRequest;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Service
public class ZoomService {

    @Value("${zoom.oauth.clientId}")
    private String clientId;

    @Value("${zoom.oauth.clientSecret}")
    private String clientSecret;

    public String generateSignature(MeetingRequest request) {
        long iat = System.currentTimeMillis() / 1000;
        long exp = request.getExpirationSeconds() != null
                ? iat + request.getExpirationSeconds()
                : iat + 60 * 60 * 2; // cộng thêm 2 tiếng

        SecretKeySpec secretKeySpec = new SecretKeySpec(clientSecret.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName());

        return Jwts.builder()
                .claim("sdkKey", clientId)
                .claim("mn", request.getMeetingNumber())
                .claim("role", request.getRole())
                .claim("iat", iat)
                .claim("exp", exp)
                .claim("tokenExp", exp)
                .claim("video_webrtc_mode", request.getVideoWebRtcMode())
                .signWith(secretKeySpec, SignatureAlgorithm.HS256)
                .compact();
    }


}
