package com.HealthConnect.Dto.Zoom;

import lombok.Data;

@Data
public class CreateMeetingRequest {
    private String topic;
    private String agenda;
    private int duration; // in minutes
    private String startTime; // ISO format, ví dụ "2025-07-02T09:00:00Z"
    private String timezone;
    private String doctorEmail; // người tạo meeting (bác sĩ)
}
