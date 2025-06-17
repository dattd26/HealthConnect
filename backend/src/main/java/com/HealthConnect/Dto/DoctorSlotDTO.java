package com.HealthConnect.Dto;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class DoctorSlotDTO {
    // private Long id;
    private Long doctorId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Duration duration;
    private String status;
}
