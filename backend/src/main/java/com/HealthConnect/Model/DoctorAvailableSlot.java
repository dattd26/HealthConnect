package com.HealthConnect.Model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.time.Duration;

import lombok.Data;

@Data
public class DoctorAvailableSlot {
    private Long id;
    private LocalDate date;
    
    private Doctor doctor;
    private List<AppointmentSlot> slots;
}
