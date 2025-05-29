package com.HealthConnect.Dto;

import java.util.Set;
import lombok.Getter;

@Getter
public class SpecialtyResponse {
    private Long id;
    private String name;
    private String description;
    private String code;
    private Set<DoctorResponse> doctors;
}
