package com.HealthConnect.Dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Positive;
import static com.HealthConnect.Constants.ValidationMessages.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AppointmentRequest {
    @NotNull(message = DOCTOR_ID_REQUIRED)
    @Positive(message = DOCTOR_ID_POSITIVE)
    private Long doctorId;
    
    @Size(max = 500, message = NOTES_SIZE)
    private String notes;
    
    @NotNull(message = APPOINTMENT_DATE_REQUIRED)
    @Future(message = APPOINTMENT_DATE_FUTURE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    
    @NotNull(message = START_TIME_REQUIRED)
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;
}
