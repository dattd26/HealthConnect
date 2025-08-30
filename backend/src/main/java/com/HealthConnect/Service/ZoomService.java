package com.HealthConnect.Service;

import com.HealthConnect.Dto.MeetingRequest;
import com.HealthConnect.Dto.Zoom.CreateMeetingRequest;
import com.HealthConnect.Dto.Zoom.ZoomMeetingResponse;
import com.HealthConnect.Dto.Zoom.ZoomTokenResponse;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class ZoomService {

    @Value("${zoom.s2s.clientId}")
    private String s2sClientId;
    @Value("${zoom.s2s.clientSecret}")
    private String s2sClientSecret;
    @Value("${zoom.s2s.apiUrl}")
    private String apiUrl;
    @Value("${zoom.s2s.accountId}")
    private String accountId;

    @Value("${zoom.sdk.clientId}")
    private String sdkClientId;
    @Value("${zoom.sdk.clientSecret}")
    private String sdkClientSecret;
    @Value("${zoom.sdk.redirectUri}")
    private String sdkRedirectUri;

    @Autowired
    private RestTemplate restTemplate;
    
    private String cachedAccessToken = null;
    private long tokenExpirationTime = 0;

    public String generateSignature(MeetingRequest request) {
        long iat = (System.currentTimeMillis() / 1000) - 30;
        long exp = request.getExpirationSeconds() != null
                ? iat + request.getExpirationSeconds()
                : iat + 60 * 60 * 2; // cộng thêm 2 tiếng

        // Create HMAC-SHA256 key
        SecretKey secretKey = Keys.hmacShaKeyFor(sdkClientSecret.getBytes(StandardCharsets.UTF_8));

        // Build JWT
        return Jwts.builder()
                .header()
                .add("alg", "HS256")
                .add("typ", "JWT")
                .and()
                .claim("appKey", sdkClientId)
                .claim("mn", request.getMeetingNumber())
                .claim("role", request.getRole())
                .claim("iat", iat)
                .claim("exp", exp)
                .claim("tokenExp", exp)
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public String getAccessToken() {
        try {
            if (cachedAccessToken != null && System.currentTimeMillis() < tokenExpirationTime - 60_000) { // neu token chua het han va con 1 phut thi tra ve token da luu
                return cachedAccessToken;
            }

            // Tạo chuỗi Basic Auth
            String auth = s2sClientId + ":" + s2sClientSecret;
            String encodedAuth = Base64.getEncoder()
                    .encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Authorization", "Basic " + encodedAuth);

            // Tạo body
        //     String body = "grant_type=account_credentials";

            HttpEntity<String> request = new HttpEntity<>(headers);
            String tokenUrl = "https://zoom.us/oauth/token?grant_type=account_credentials&account_id="+accountId;
            // Gửi request
            ResponseEntity<ZoomTokenResponse> response = restTemplate.exchange(
                    tokenUrl,
                    HttpMethod.POST,
                    request,
                    ZoomTokenResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                cachedAccessToken = response.getBody().getAccessToken();
                tokenExpirationTime = System.currentTimeMillis() + response.getBody().getExpiresIn() * 1000;
                return cachedAccessToken;
            } else {
                throw new RuntimeException("Failed to get token. Status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error while requesting Zoom token", e);
        }
    }
    
    public ZoomMeetingResponse createMeeting(CreateMeetingRequest meetingRequest) {
        String accessToken = getAccessToken();
        if (accessToken == null) {
            throw new RuntimeException("Failed to get access token");
        }
        // return accessToken;
        String url = apiUrl + "/users/me/meetings";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        // Chuẩn bị payload
        Map<String, Object> body = new HashMap<>();
        body.put("topic", meetingRequest.getTopic());
        body.put("agenda", meetingRequest.getAgenda());
        body.put("duration", meetingRequest.getDuration());
        body.put("start_time", meetingRequest.getStartTime());
        body.put("timezone", meetingRequest.getTimezone());
        body.put("type", 2); // scheduled meeting

        Map<String, Object> settings = new HashMap<>();
        settings.put("host_video", true);
        settings.put("participant_video", true);
        settings.put("waiting_room", true);
        settings.put("auto_recording", "cloud");
        body.put("settings", settings);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<ZoomMeetingResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                ZoomMeetingResponse.class
        );

        if (response.getStatusCode() == HttpStatus.CREATED) {
            return response.getBody();
        } else {
            throw new RuntimeException("Failed to create meeting: " + response.getStatusCode());
        }
    }

    public ZoomMeetingResponse getMeeting(String meetingId) {
        String accessToken = getAccessToken();
        if (accessToken == null) {
            throw new RuntimeException("Failed to get access token");
        }
        String url = apiUrl + "/meetings/" + meetingId;
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<ZoomMeetingResponse> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                ZoomMeetingResponse.class
        );
        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new RuntimeException("Failed to get meeting: " + response.getStatusCode());
        }
    }
}