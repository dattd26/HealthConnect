package com.HealthConnect.Model;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;

import java.time.Duration;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "doctor_slots")
public class DoctorSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
    
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Duration duration;
    @Enumerated(EnumType.STRING)
    private SlotStatus status; 
    
    public enum SlotStatus {
        AVAILABLE,
        BOOKED
    }
    @OneToMany(mappedBy = "doctorSlot")
    private Set<Appointment> appointments;
}
