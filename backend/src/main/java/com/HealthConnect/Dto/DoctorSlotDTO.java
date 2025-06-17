package com.HealthConnect.Dto;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class DoctorSlotDTO {
    // private Long id;
    private Long doctorId;
    private LocalDate date;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;
    private Duration duration;
    private String status;
}
