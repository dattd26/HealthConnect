package com.HealthConnect.Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "payments",
       indexes = {
           @Index(name = "idx_payments_order_id", columnList = "orderId")
       })
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1-1: Payment là "owner", giữ khóa ngoại, unique để đảm bảo 1 cuộc hẹn chỉ có 1 payment
    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    @JsonManagedReference(value = "appointment-payment")
    private Appointment appointment;

    @Column(nullable = false, unique = true, length = 64)
    private String orderId;

    @Column(precision = 18, scale = 2)
    private BigDecimal amount;

    @Column(precision = 18, scale = 2)
    private BigDecimal appointmentAmount; // Số tiền khám bệnh

    @Column(nullable = false, length = 8)
    private String currency = "VND";

    @Column(nullable = false)
    private PaymentStatus status;

    @Column(nullable = false)
    private PaymentMethod method;

    @Column(length = 64)
    private String vnpayTransactionId;

    @Column(length = 16)
    private String vnpayResponseCode;

    @Column(length = 255)
    private String vnpayResponseMessage;

    @Column(length = 255)
    private String vnpaySecureHash;

    @Column(length = 64)
    private String vnpayTxnRef;

    @Column
    private LocalDateTime paymentDate;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String returnUrl;

    @Column(length = 1000)
    private String cancelUrl;

    public enum PaymentStatus {
        PENDING,
        SUCCESS,
        FAILED,
        CANCELLED,
        EXPIRED
    }

    public enum PaymentMethod {
        VNPAY,
        CASH,
        BANK_TRANSFER
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
