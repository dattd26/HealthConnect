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
import jakarta.persistence.Version;
import jakarta.persistence.Index;
import jakarta.persistence.UniqueConstraint;

import java.time.Duration;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "doctor_slots", indexes = {
    @Index(name = "idx_doctor_date", columnList = "doctor_id, date"),
    @Index(name = "idx_doctor_date_time", columnList = "doctor_id, date, startTime"),
    @Index(name = "idx_doctor_status", columnList = "doctor_id, status"),
    @Index(name = "idx_date_status", columnList = "date, status")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_doctor_slot_unique", columnNames = {"doctor_id", "date", "startTime"})
})
public class DoctorSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Version
    private Long version; // For optimistic locking
    
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
        BOOKED,
        BLOCKED // For maintenance or doctor unavailability
    }
    
    @OneToMany(mappedBy = "doctorSlot")
    private Set<Appointment> appointments;
}
