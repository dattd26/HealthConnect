package com.HealthConnect.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecordDTO {
    private String bloodType;
    private double height;
    private double weight;
    private double bmi;
    private List<String> medicalConditions;
    private List<String> allergies;
    private List<String> medications;
}
