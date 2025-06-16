package com.HealthConnect.Dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Duration;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class AppointmentSlotDTO {
    // private Long id;
    private Long doctorId;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;
    
    private Duration duration;
    private String status;
} 