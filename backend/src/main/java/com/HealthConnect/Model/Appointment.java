package com.HealthConnect.Model;

import java.time.LocalDateTime;
import java.math.BigDecimal;

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
        PENDING_PAYMENT,    // Chờ thanh toán
        PAYMENT_PENDING,    // Đã thanh toán, chờ xác nhận
        CONFIRMED,          // Bác sĩ đã xác nhận
        IN_PROGRESS,        // Đang khám bệnh
        COMPLETED,          // Hoàn thành khám
        CANCELLED,          // Đã hủy
        EXPIRED,            // Hết hạn (quá thời gian)
        NO_SHOW             // Bệnh nhân không tham gia
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
    
    @Column
    private BigDecimal amount;
    
    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL)
    private Payment payment;
}