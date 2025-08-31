package com.HealthConnect.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthConnect.Model.Payment;
import com.HealthConnect.Model.Payment.PaymentStatus;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByVnpayTxnRef(String vnpayTxnRef);
    Optional<Payment> findByOrderId(String orderId);
    Optional<Payment> findByAppointmentId(Long appointmentId);
    List<Payment> findAllByOrderId(String orderId);
    List<Payment> findByStatus(PaymentStatus status);
}
