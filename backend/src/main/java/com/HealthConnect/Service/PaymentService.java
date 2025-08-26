package com.HealthConnect.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.Payment;
import com.HealthConnect.Model.Payment.PaymentStatus;
import com.HealthConnect.Model.Payment.PaymentMethod;
import com.HealthConnect.Repository.AppointmentRepository;
import com.HealthConnect.Repository.PaymentRepository;
import com.HealthConnect.Dto.VNPay.VNPayPaymentRequest;
import com.HealthConnect.Dto.VNPay.VNPayPaymentResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private VNPayService vnpayService;
    
    public Payment createPayment(Long appointmentId, BigDecimal amount, PaymentMethod method) {
        try {
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
            if (appointmentOpt.isEmpty()) {
                throw new RuntimeException("Appointment not found with id: " + appointmentId);
            }
            
            Appointment appointment = appointmentOpt.get();
            
            // Kiểm tra status của appointment
            if (appointment.getStatus() != Appointment.AppointmentStatus.PENDING_PAYMENT) {
                throw new RuntimeException("Appointment status is not valid for payment: " + appointment.getStatus());
            }
            
            Payment payment = new Payment();
            payment.setAppointment(appointment);
            payment.setOrderId(generateOrderId(appointmentId));
            payment.setAmount(amount);
            payment.setAppointmentAmount(amount); // Số tiền khám bệnh
            payment.setStatus(PaymentStatus.PENDING);
            payment.setMethod(method);
            payment.setDescription("Thanh toán lịch hẹn khám bệnh online - " + appointment.getId());
            
            Payment savedPayment = paymentRepository.save(payment);
            
            // Update appointment amount
            appointment.setAmount(amount);
            appointmentRepository.save(appointment);
            
            log.info("Payment created successfully for appointment: {}", appointmentId);
            return savedPayment;
            
        } catch (Exception e) {
            log.error("Error creating payment: ", e);
            throw new RuntimeException("Failed to create payment: " + e.getMessage());
        }
    }
    
    public VNPayPaymentResponse createVNPayPayment(VNPayPaymentRequest request) {
        try {
            log.info("Creating VNPay payment for appointment: {}, amount: {}", request.getAppointmentId(), request.getAmount());
            
            // Create payment record
            Payment payment = createPayment(
                request.getAppointmentId(), 
                request.getAmount(), 
                PaymentMethod.VNPAY
            );
            
            log.info("Payment created with orderId: {}", payment.getOrderId());
            
            // Set return and cancel URLs with orderId parameter
            String returnUrl = request.getReturnUrl() + "?orderId=" + payment.getOrderId();
            String cancelUrl = request.getCancelUrl() + "?orderId=" + payment.getOrderId();
            
            log.info("Return URL: {}", returnUrl);
            log.info("Cancel URL: {}", cancelUrl);
            
            // Create VNPay payment URL
            VNPayPaymentResponse vnpayResponse = vnpayService.createPaymentUrl(request);
            
            log.info("VNPay response: {}", vnpayResponse);
            
            // Update payment with VNPay transaction reference
            if ("SUCCESS".equals(vnpayResponse.getStatus())) {
                payment.setVnpayTxnRef(vnpayResponse.getVnpayTxnRef());
                payment.setReturnUrl(returnUrl);
                payment.setCancelUrl(cancelUrl);
                paymentRepository.save(payment);
                log.info("Payment updated with VNPay transaction reference: {}", payment.getVnpayTxnRef());
            }
            
            return vnpayResponse;
            
        } catch (Exception e) {
            log.error("Error creating VNPay payment: ", e);
            VNPayPaymentResponse errorResponse = new VNPayPaymentResponse();
            errorResponse.setStatus("ERROR");
            errorResponse.setMessage("Failed to create VNPay payment: " + e.getMessage());
            return errorResponse;
        }
    }
    
    public Payment getPaymentByOrderId(String orderId) {
        Optional<Payment> paymentOpt = paymentRepository.findByOrderId(orderId);
        if (paymentOpt.isEmpty()) {
            throw new RuntimeException("Payment not found with order ID: " + orderId);
        }
        return paymentOpt.get();
    }
    
    public Payment getPaymentByAppointmentId(Long appointmentId) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isEmpty()) {
            throw new RuntimeException("Appointment not found with id: " + appointmentId);
        }
        
        Appointment appointment = appointmentOpt.get();
        if (appointment.getPayment() == null) {
            throw new RuntimeException("No payment found for appointment: " + appointmentId);
        }
        
        return appointment.getPayment();
    }
    
    public List<Payment> getPaymentsByStatus(PaymentStatus status) {
        // Implementation to get payments by status
        return paymentRepository.findAll(); // Simplified for now
    }
    
    public Payment updatePaymentStatus(Long paymentId, PaymentStatus status) {
        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        if (paymentOpt.isEmpty()) {
            throw new RuntimeException("Payment not found with id: " + paymentId);
        }
        
        Payment payment = paymentOpt.get();
        payment.setStatus(status);
        
        if (status == PaymentStatus.SUCCESS) {
            payment.setPaymentDate(LocalDateTime.now());
            
            // Cập nhật status của appointment thành PAYMENT_PENDING
            Appointment appointment = payment.getAppointment();
            appointment.setStatus(Appointment.AppointmentStatus.PAYMENT_PENDING);
            appointmentRepository.save(appointment);
            
            log.info("Payment successful for appointment: {}, updating status to PAYMENT_PENDING", appointment.getId());
        }
        
        return paymentRepository.save(payment);
    }
    
    private String generateOrderId(Long appointmentId) {
        return "HC" + System.currentTimeMillis() + "_" + appointmentId;
    }
}
