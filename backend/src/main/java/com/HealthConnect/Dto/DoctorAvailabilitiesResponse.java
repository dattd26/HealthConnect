package com.HealthConnect.Dto;

import java.util.List;

import lombok.Data;

@Data
public class DoctorAvailabilitiesResponse {
    private Long doctorId;
    private List<AvailabilityDto> availabilities;
}
