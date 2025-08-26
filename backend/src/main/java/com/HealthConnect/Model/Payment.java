package com.HealthConnect.Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;
    
    @Column(nullable = false)
    private String orderId;
    
    @Column
    private BigDecimal amount;
    
    @Column
    private BigDecimal appointmentAmount; // Số tiền khám bệnh
    
    @Column(nullable = false)
    private String currency = "VND";
    
    @Column(nullable = false)
    private PaymentStatus status;
    
    @Column(nullable = false)
    private PaymentMethod method;
    
    @Column
    private String vnpayTransactionId;
    
    @Column
    private String vnpayResponseCode;
    
    @Column
    private String vnpayResponseMessage;
    
    @Column
    private String vnpaySecureHash;
    
    @Column
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
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
