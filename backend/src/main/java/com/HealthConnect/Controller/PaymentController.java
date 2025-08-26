package com.HealthConnect.Controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.HealthConnect.Model.Payment;
import com.HealthConnect.Model.Payment.PaymentStatus;
import com.HealthConnect.Model.Payment.PaymentMethod;
import com.HealthConnect.Service.PaymentService;
import com.HealthConnect.Dto.VNPay.VNPayPaymentRequest;
import com.HealthConnect.Dto.VNPay.VNPayPaymentResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping("/create")
    public ResponseEntity<Payment> createPayment(
            @RequestParam Long appointmentId,
            @RequestParam BigDecimal amount,
            @RequestParam PaymentMethod method) {
        try {
            Payment payment = paymentService.createPayment(appointmentId, amount, method);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error creating payment: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/vnpay/create")
    public ResponseEntity<VNPayPaymentResponse> createVNPayPayment(@RequestBody VNPayPaymentRequest request) {
        try {
            log.info("Received VNPay payment request: {}", request);
            
            VNPayPaymentResponse response = paymentService.createVNPayPayment(request);
            
            log.info("VNPay payment response: {}", response);
            
            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok(response);
            } else {
                log.warn("VNPay payment creation failed: {}", response.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error creating VNPay payment: ", e);
            VNPayPaymentResponse errorResponse = new VNPayPaymentResponse();
            errorResponse.setStatus("ERROR");
            errorResponse.setMessage("Failed to create VNPay payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable String orderId) {
        try {
            Payment payment = paymentService.getPaymentByOrderId(orderId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error getting payment by order ID: ", e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<Payment> getPaymentByAppointmentId(@PathVariable Long appointmentId) {
        try {
            Payment payment = paymentService.getPaymentByAppointmentId(appointmentId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error getting payment by appointment ID: ", e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable PaymentStatus status) {
        try {
            List<Payment> payments = paymentService.getPaymentsByStatus(status);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            log.error("Error getting payments by status: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{paymentId}/status")
    public ResponseEntity<Payment> updatePaymentStatus(
            @PathVariable Long paymentId,
            @RequestParam PaymentStatus status) {
        try {
            Payment payment = paymentService.updatePaymentStatus(paymentId, status);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error updating payment status: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Payment>> getAllPayments() {
        try {
            List<Payment> payments = paymentService.getPaymentsByStatus(null);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            log.error("Error getting all payments: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
