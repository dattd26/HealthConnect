package com.HealthConnect.Dto;

import java.util.List;

import com.HealthConnect.Model.DoctorAvailability;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DoctorResponse extends UserDTO {
    private String license;
    private List<DoctorAvailability> availabilities;
}
