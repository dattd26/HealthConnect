package com.HealthConnect.Model;

import java.time.LocalDateTime;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonManagedReference(value = "patient-appointments")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonBackReference(value = "doctor-appointments")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "doctor_slot_id", nullable = false)
    @JsonManagedReference(value = "doctor-slot-appointments")
    private DoctorSlot doctorSlot;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private AppointmentStatus status;


    public enum AppointmentStatus {
        PENDING_PAYMENT,    // Chờ thanh toán
        PAYMENT_PENDING,    // Đã thanh toán, chờ xác nhận (có thể đổi tên: PAID_PENDING_CONFIRMATION)
        CONFIRMED,          // Bác sĩ đã xác nhận
        IN_PROGRESS,        // Đang khám bệnh
        COMPLETED,          // Hoàn thành khám
        CANCELLED,          // Đã hủy
        EXPIRED,            // Hết hạn (quá thời gian)
        NO_SHOW             // Bệnh nhân không tham gia
    }

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Column
    private String zoomMeetingId;

    @Column(length = 1000)
    private String zoomJoinUrl;

    @Column(length = 1000)
    private String zoomStartUrl;

    @Column
    private String zoomPassword;

    @Column(precision = 18, scale = 2)
    private BigDecimal amount;

    // Quan hệ 1-1, Appointment là "owner" hay Payment là "owner" đều được.
    // Ở đây để Payment là owner (giữ khóa ngoại), nên dùng mappedBy tại Appointment.
    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonBackReference(value = "appointment-payment")
    private Payment payment;

    @Column
    private boolean isDoctorJoined;
}
