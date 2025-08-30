package com.HealthConnect.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "medical_specialties")
public class MedicalSpecialty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String code;

    // Many-to-many relationship
    @JsonManagedReference(value = "doctor-specialties")
    @ManyToMany(mappedBy = "specialties")
    private Set<Doctor> doctors = new HashSet<>();
}