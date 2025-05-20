package com.HealthConnect.Controller;

import com.HealthConnect.Dto.HealthDataRequest;
import com.HealthConnect.Model.HealthData;
import com.HealthConnect.Model.User;
import com.HealthConnect.Repository.HealthDataRepository;
import com.HealthConnect.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/health-data")
public class HealthDataController {

    @Autowired
    private HealthDataRepository healthDataRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<HealthData>> getHealthData(
            @RequestParam String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false)@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @AuthenticationPrincipal UserDetails userDetails
            ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userService.getUserByUsername(userDetails.getUsername());
        if (start == null) start = LocalDateTime.now().minusDays(99);
        if (end == null) end = LocalDateTime.now();

//        if (!List.of("BLOOD_PRESSURE", "BLOOD_GLUCOSE", "HEART_RATE", "BODY_TEMPERATURE").contains(type)) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid health data type");
//        }

        List<HealthData> data = healthDataRepository.findByUserAndTypeAndTimestampBetween(user.getId(), type, start, end);

        return ResponseEntity.ok(data);
    }

    @PostMapping
    public ResponseEntity<HealthData> addHealthData(
            @RequestBody HealthDataRequest request,
            @AuthenticationPrincipal UserDetails userDetails
            ) {
        User user = userService.getUserByUsername(userDetails.getUsername());

        HealthData data = new HealthData(
                user,
                request.getType(),
                request.getValue(),
                LocalDateTime.now()
        );

        HealthData savedData = healthDataRepository.save(data);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedData);

    }
}
