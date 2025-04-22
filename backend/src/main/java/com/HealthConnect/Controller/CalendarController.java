package com.HealthConnect.Controller;

import com.HealthConnect.Service.GoogleCalendarService;
import com.google.api.services.calendar.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private GoogleCalendarService googleCalendarService;

    @PostMapping("/create-event")
    public ResponseEntity<?> createEvent(@RequestBody Map<String, String> request) {
        try {
            Event event = googleCalendarService.createEvent(
                    request.get("title"),
                    request.get("description"),
                    request.get("startTime"),
                    request.get("endTime")
            );

            return ResponseEntity.ok(Map.of(
                    "eventTitle", event.getSummary(),
                    "description", event.getDescription(),
                    "eventTime", event.getStart().getDateTime().toString(),
                    "googleMeetLink", event.getHangoutLink()
            ));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}
