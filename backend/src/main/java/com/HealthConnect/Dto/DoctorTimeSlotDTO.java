package com.HealthConnect.Dto;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalTime;

import lombok.Data;

@Data
public class DoctorTimeSlotDTO {
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Duration duration;
}
