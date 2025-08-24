package com.HealthConnect.Dto;

import java.util.List;
import java.util.Set;

import com.HealthConnect.Model.DoctorAvailability;
import com.HealthConnect.Model.MedicalSpecialty;

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
    private String hospital;
    private Set<MedicalSpecialty> specialties;
    private List<DoctorAvailability> availabilities;
}
