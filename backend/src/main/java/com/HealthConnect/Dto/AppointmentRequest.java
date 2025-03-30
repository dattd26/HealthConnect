package com.HealthConnect.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
public class AppointmentRequest {
    private Long doctorId;
    private String notes;
    private LocalDateTime appointmentTime;
}
