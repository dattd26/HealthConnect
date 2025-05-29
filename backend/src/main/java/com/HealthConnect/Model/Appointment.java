package com.HealthConnect.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    private LocalDateTime startTime;
    private LocalDateTime endTime;


    @Column(nullable = false)
    private String status; // SCHEDULED, COMPLETED, CANCELLED

    @Column
    private String notes; // Ghi chú của bác sĩ hoặc bệnh nhân
}