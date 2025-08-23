package com.HealthConnect.Dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorAvailabilitiesResponse {
    private Long doctorId;
    private List<AvailabilityDto> availabilities;
}
