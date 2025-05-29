package com.HealthConnect.Model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "doctors")
public class Doctor extends User {
    @ManyToMany
    @JoinTable(
        name = "doctors_specialties",
        joinColumns = @jakarta.persistence.JoinColumn(name = "doctor_id"),
        inverseJoinColumns = @jakarta.persistence.JoinColumn(name = "specialty_id")
    )
    @JsonBackReference
    private List<MedicalSpecialty> specialties;
    private String license;
    private String hospital;
    private List<WeeklyAvailableSlot> weeklySlots;
}
