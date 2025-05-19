package com.HealthConnect.Controller;

import com.HealthConnect.Dto.MeetingRequest;
import com.HealthConnect.Service.ZoomService;
import com.google.api.services.meet.v2.Meet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/zoom")
public class ZoomController {
    @Autowired
    ZoomService zoomService;

    @PostMapping
    public ResponseEntity<?> testGetSignature(@RequestBody MeetingRequest request) {
        Map<String, String> res = new HashMap<>();
        res.put("signature", zoomService.generateSignature(new MeetingRequest("86541680818",
                1, null, null, "LxZv29")));
        res.put("sdkKey", "q48VIOcOS7Wb6xCsjQI5bg");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/callback")
    public String callBack(@RequestParam("code") String code) {
        return code;
    }
}
