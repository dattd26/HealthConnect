package com.HealthConnect.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthConnect.Model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByVnpayTxnRef(String vnpayTxnRef);
    Optional<Payment> findByOrderId(String orderId);
}
