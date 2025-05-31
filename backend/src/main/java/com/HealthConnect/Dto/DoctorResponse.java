package com.HealthConnect.Dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorResponse extends UserDTO {
    private String license;
    private List<DoctorTimeSlotDTO> timeslots;
}
