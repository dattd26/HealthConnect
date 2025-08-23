package com.HealthConnect.Model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonBackReference(value = "patient-appointments")
    private Patient patient; 

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonBackReference(value = "doctor-appointments")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "doctor_slot_id", nullable = false)
    private DoctorSlot doctorSlot;

    @Column(nullable = false)
    private AppointmentStatus status;

    public enum AppointmentStatus {
        WAITING,
        CONFIRMED,
        CANCELLED
    }

    @Column
    private String notes; // Ghi chú của bác sĩ hoặc bệnh nhân
    @Column
    private LocalDateTime createdAt;
    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Column
    private String zoomMeetingId;
    @Column
    private String zoomJoinUrl;
    @Column(length = 1000)
    private String zoomStartUrl;
    @Column
    private String zoomPassword;
}