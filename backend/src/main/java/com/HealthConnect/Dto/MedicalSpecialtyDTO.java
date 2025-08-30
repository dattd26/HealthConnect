package com.HealthConnect.Dto;

import lombok.Data;
import java.util.Set;

@Data
public class MedicalSpecialtyDTO {
    private Long id;
    private String name;
    private String description;
    private String code;
    private Set<DoctorResponse> doctors;
}
