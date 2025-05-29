package com.HealthConnect.Model;

import java.time.DayOfWeek;
import java.time.Duration;

import lombok.Data;

@Data
public class WeeklyAvailableSlot {
    private DayOfWeek dayOfWeek;
    private String startTime;
    private String endTime;
    private Duration duration;
}
