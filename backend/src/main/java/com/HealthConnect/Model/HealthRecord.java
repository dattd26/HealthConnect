package com.HealthConnect.Model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.util.List;

@Table(name = "health_records")
@Entity
@Data
public class HealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JsonBackReference
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    private String bloodType;
    private double height;
    private double weight;
    private double bmi;
    private List<String> medicalConditions;
    private List<String> allergies;
    private List<String> medications;
}
