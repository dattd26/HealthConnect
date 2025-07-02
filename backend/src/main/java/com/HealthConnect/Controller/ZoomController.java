package com.HealthConnect.Controller;

import com.HealthConnect.Dto.MeetingRequest;
import com.HealthConnect.Dto.Zoom.CreateMeetingRequest;
import com.HealthConnect.Dto.Zoom.ZoomMeetingResponse;
import com.HealthConnect.Service.ZoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/zoom")
public class ZoomController {
    @Autowired
    ZoomService zoomService;

    @PostMapping
    public ResponseEntity<?> testGetSignature(@RequestBody MeetingRequest request) {
        Map<String, String> res = new HashMap<>();
        res.put("signature", zoomService.generateSignature(new MeetingRequest(request.getMeetingNumber(),
                request.getRole(), null, null, "kajW83")));
        res.put("sdkKey", "q48VIOcOS7Wb6xCsjQI5bg");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/callback")
    public String callBack(@RequestParam("code") String code) {
        return code;
    }

    @PostMapping("/create-meeting")
    public ZoomMeetingResponse createMeeting(@RequestBody CreateMeetingRequest meetingRequest) {
        return zoomService.createMeeting(meetingRequest);
    }
}
