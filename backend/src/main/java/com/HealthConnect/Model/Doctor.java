package com.HealthConnect.Model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
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
        joinColumns = @JoinColumn(name = "doctor_id"),
        inverseJoinColumns = @JoinColumn(name = "specialty_id")
    )
    @JsonBackReference(value = "doctor-specialties") 
    private Set<MedicalSpecialty> specialties = new HashSet<>(); 

    private String license;
    private String hospital;

    @OneToMany(mappedBy = "doctor")
    @JsonBackReference(value = "doctor-appointments")
    private Set<Appointment> appointments; 
    
    @OneToMany(mappedBy = "doctor")
    @JsonBackReference(value = "doctor-availabilities")
    private List<DoctorAvailability> availabilities;

    // @OneToMany(mappedBy = "doctor")
    // @JsonBackReference(value = "doctor-slots")
    // private Set<AppointmentSlot> slots = new HashSet<>();
}