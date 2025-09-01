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
            
            if (appointment.getStatus() != Appointment.AppointmentStatus.PENDING_PAYMENT) {
                throw new RuntimeException("Appointment status is not valid for payment: " + appointment.getStatus());
            }
            
            Payment payment = new Payment();
            payment.setAppointment(appointment);
            payment.setOrderId(generateOrderId(appointmentId));
            payment.setAmount(amount);
            payment.setAppointmentAmount(amount); 
            payment.setStatus(PaymentStatus.PENDING);
            payment.setMethod(method);
            payment.setDescription("Thanh toán lịch hẹn khám bệnh online - " + appointment.getId());
            
            Payment savedPayment = paymentRepository.save(payment);
            
           
            appointment.setAmount(amount);
            appointmentRepository.save(appointment);
            
            log.info("Payment created successfully for appointment: {}", appointmentId);
            return savedPayment;
            
        } catch (Exception e) {
            log.error("Error creating payment: ", e);
            throw new RuntimeException("Failed to create payment: " + e.getMessage());
        }
    }

    public Payment createPaymentForAppointment(Long appointmentId, PaymentMethod method) {
        try {
            log.info("Creating payment for appointment: {}", appointmentId);
            
                
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
            if (appointmentOpt.isEmpty()) {
                throw new RuntimeException("Appointment not found with id: " + appointmentId);
            }
            
            Appointment appointment = appointmentOpt.get();
            
            if (appointment.getStatus() != Appointment.AppointmentStatus.PENDING_PAYMENT) {
                throw new RuntimeException("Appointment status is not valid for payment: " + appointment.getStatus());
            }
            
            Optional<Payment> existingPaymentOpt = paymentRepository.findByAppointmentId(appointmentId);
            Payment payment;
            
            if (existingPaymentOpt.isPresent()) {
                payment = existingPaymentOpt.get();
                log.info("Found existing payment with ID: {} for appointment: {}", payment.getId(), appointmentId);
                
                if (payment.getStatus() == PaymentStatus.SUCCESS) {
                    throw new RuntimeException("Payment already completed for this appointment");
                }
                
                if (payment.getStatus() == PaymentStatus.FAILED || payment.getStatus() == PaymentStatus.CANCELLED) {
                    log.info("Updating existing failed/cancelled payment for appointment: {}", appointmentId);
                    payment.setStatus(PaymentStatus.PENDING);
                    payment.setMethod(method);
                    payment.setUpdatedAt(LocalDateTime.now());
                }

            } else {
                // Tạo payment mới nếu chưa có
                log.info("Creating new payment for appointment: {}", appointmentId);
                payment = new Payment();
                payment.setAppointment(appointment);
                payment.setOrderId(generateOrderId(appointmentId));
                payment.setStatus(PaymentStatus.PENDING);
                payment.setMethod(method);
            }
            
            BigDecimal amount = appointment.getAmount();
            if (amount == null) {
                amount = new BigDecimal("200000"); // Giá mặc định 200,000 VND
                appointment.setAmount(amount);
                appointmentRepository.save(appointment);
            }
            
            payment.setAmount(amount);
            payment.setAppointmentAmount(amount);
            payment.setDescription("Thanh toán lịch hẹn khám bệnh online - " + appointment.getId());
            
            Payment savedPayment = paymentRepository.save(payment);
            
            log.info("Payment created/updated successfully for appointment: {} with orderId: {}", appointmentId, savedPayment.getOrderId());
            return savedPayment;
            
        } catch (Exception e) {
            log.error("Error creating payment for appointment: ", e);
            throw new RuntimeException("Failed to create payment for appointment: " + e.getMessage());
        }
    }

    public VNPayPaymentResponse createVNPayPaymentForAppointment(Long appointmentId, String returnUrl, String cancelUrl, jakarta.servlet.http.HttpServletRequest httpRequest) {
        try {
            log.info("Creating VNPay payment for appointment: {}", appointmentId);
            
            // Lấy thông tin cuộc hẹn trước
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
            if (appointmentOpt.isEmpty()) {
                throw new RuntimeException("Appointment not found with id: " + appointmentId);
            }
            
            Appointment appointment = appointmentOpt.get();
            
            // Kiểm tra status của appointment
            if (appointment.getStatus() != Appointment.AppointmentStatus.PENDING_PAYMENT) {
                throw new RuntimeException("Appointment status is not valid for payment: " + appointment.getStatus());
            }
            
            // Kiểm tra xem đã có payment nào cho appointment này chưa
            Optional<Payment> existingPaymentOpt = paymentRepository.findByAppointmentId(appointmentId);
            Payment payment;
            
            if (existingPaymentOpt.isPresent()) {
                // Nếu đã có payment, kiểm tra trạng thái
                payment = existingPaymentOpt.get();
                log.info("Found existing payment with ID: {} for appointment: {}", payment.getId(), appointmentId);
                
                // Nếu payment đã thành công, không cho phép tạo mới
                if (payment.getStatus() == PaymentStatus.SUCCESS) {
                    throw new RuntimeException("Payment already completed for this appointment");
                }
                
                // Nếu payment thất bại hoặc bị hủy, cập nhật thông tin mới
                if (payment.getStatus() == PaymentStatus.FAILED || payment.getStatus() == PaymentStatus.CANCELLED) {
                    log.info("Updating existing failed/cancelled payment for appointment: {}", appointmentId);
                    payment.setStatus(PaymentStatus.PENDING);
                    payment.setMethod(PaymentMethod.VNPAY);
                    payment.setUpdatedAt(LocalDateTime.now());
                }
                // Nếu payment đang PENDING, giữ nguyên
            } else {
                // Tạo payment mới nếu chưa có
                log.info("Creating new payment for appointment: {}", appointmentId);
                payment = new Payment();
                payment.setAppointment(appointment);
                // Sử dụng generateOrderId để có thể tái sử dụng orderId cũ
                
                payment.setOrderId(generateOrderId(appointmentId));
                payment.setStatus(PaymentStatus.PENDING);
                payment.setMethod(PaymentMethod.VNPAY);
            }
            
            // Sử dụng số tiền từ appointment nếu có, nếu không thì dùng giá mặc định
            BigDecimal amount = appointment.getAmount();
            if (amount == null) {
                amount = new BigDecimal("200000"); // Giá mặc định 200,000 VND
                appointment.setAmount(amount);
                appointmentRepository.save(appointment);
            }
            
            // Cập nhật thông tin payment
            payment.setAmount(amount);
            payment.setAppointmentAmount(amount);
            payment.setDescription("Thanh toán lịch hẹn khám bệnh online - " + appointment.getId());
            
            Payment savedPayment = paymentRepository.save(payment);
            
            log.info("Payment created/updated with orderId: {}", savedPayment.getOrderId());
            
            // Set return and cancel URLs với orderId parameter
            String finalReturnUrl = returnUrl + "?orderId=" + savedPayment.getOrderId();
            String finalCancelUrl = cancelUrl + "?orderId=" + savedPayment.getOrderId();
            
            log.info("Return URL: {}", finalReturnUrl);
            log.info("Cancel URL: {}", finalCancelUrl);
            
            // Tạo VNPay payment request với đầy đủ thông tin
            VNPayPaymentRequest vnpayRequest = new VNPayPaymentRequest();
            vnpayRequest.setAppointmentId(appointmentId);
            vnpayRequest.setAmount(amount);
            vnpayRequest.setOrderId(savedPayment.getOrderId());
            vnpayRequest.setDescription("Thanh toán lịch hẹn khám bệnh online - " + appointment.getId());
            vnpayRequest.setReturnUrl(finalReturnUrl);
            vnpayRequest.setCancelUrl(finalCancelUrl);
            
            // Tạo VNPay payment URL
            VNPayPaymentResponse vnpayResponse = vnpayService.createPaymentUrl(vnpayRequest, httpRequest);
            
            log.info("VNPay response: {}", vnpayResponse);
            
            // Cập nhật payment với VNPay transaction reference
            if ("SUCCESS".equals(vnpayResponse.getStatus())) {
                savedPayment.setVnpayTxnRef(vnpayResponse.getVnpayTxnRef());
                savedPayment.setVnpaySecureHash(vnpayResponse.getSecureHash());
                savedPayment.setReturnUrl(finalReturnUrl);
                savedPayment.setCancelUrl(finalCancelUrl);
                paymentRepository.save(savedPayment);
                log.info("Payment updated with VNPay transaction reference: {}", savedPayment.getVnpayTxnRef());
            }
            
            return vnpayResponse;
            
        } catch (Exception e) {
            log.error("Error creating VNPay payment for appointment: ", e);
            VNPayPaymentResponse errorResponse = new VNPayPaymentResponse();
            errorResponse.setStatus("ERROR");
            errorResponse.setMessage("Failed to create VNPay payment for appointment: " + e.getMessage());
            return errorResponse;
        }
    }
    
    public VNPayPaymentResponse createVNPayPayment(VNPayPaymentRequest request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        try {
            log.info("Creating VNPay payment for appointment: {}, amount: {}", request.getAppointmentId(), request.getAmount());
            
            // Validate request
            if (request.getAppointmentId() == null || request.getAmount() == null) {
                throw new RuntimeException("Appointment ID and Amount are required");
            }
            
            // Lấy thông tin cuộc hẹn
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(request.getAppointmentId());
            if (appointmentOpt.isEmpty()) {
                throw new RuntimeException("Appointment not found with id: " + request.getAppointmentId());
            }
            
            Appointment appointment = appointmentOpt.get();
            
            // Kiểm tra status của appointment
            if (appointment.getStatus() != Appointment.AppointmentStatus.PENDING_PAYMENT) {
                throw new RuntimeException("Appointment status is not valid for payment: " + appointment.getStatus());
            }
            
            // Tạo payment record
            Payment payment = new Payment();
            payment.setAppointment(appointment);
            payment.setOrderId(request.getOrderId() != null ? request.getOrderId() : generateOrderId(request.getAppointmentId()));
            payment.setAmount(request.getAmount());
            payment.setAppointmentAmount(request.getAmount());
            payment.setStatus(PaymentStatus.PENDING);
            payment.setMethod(PaymentMethod.VNPAY);
            payment.setDescription(request.getDescription() != null ? request.getDescription() : 
                "Thanh toán lịch hẹn khám bệnh online - " + appointment.getId());
            
            Payment savedPayment = paymentRepository.save(payment);
            
            log.info("Payment created with orderId: {}", savedPayment.getOrderId());
            
            // Set return and cancel URLs với orderId parameter
            String returnUrl = request.getReturnUrl() + "?orderId=" + savedPayment.getOrderId();
            String cancelUrl = request.getCancelUrl() + "?orderId=" + savedPayment.getOrderId();
            
            log.info("Return URL: {}", returnUrl);
            log.info("Cancel URL: {}", cancelUrl);
            
            // Cập nhật request với orderId thực tế
            request.setOrderId(savedPayment.getOrderId());
            
            // Tạo VNPay payment URL
            VNPayPaymentResponse vnpayResponse = vnpayService.createPaymentUrl(request, httpRequest);
            
            log.info("VNPay response: {}", vnpayResponse);
            
            // Cập nhật payment với VNPay transaction reference
            if ("SUCCESS".equals(vnpayResponse.getStatus())) {
                savedPayment.setVnpayTxnRef(vnpayResponse.getVnpayTxnRef());
                savedPayment.setReturnUrl(returnUrl);
                savedPayment.setCancelUrl(cancelUrl);
                paymentRepository.save(savedPayment);
                log.info("Payment updated with VNPay transaction reference: {}", savedPayment.getVnpayTxnRef());
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
        try {
            log.info("Looking for payment with order ID: {}", orderId);
            
            // Tìm tất cả payment với orderId này
            List<Payment> payments = paymentRepository.findAllByOrderId(orderId);
            
            if (payments.isEmpty()) {
                log.warn("No payment found with order ID: {}", orderId);
                throw new RuntimeException("Payment not found with order ID: " + orderId);
            }
            
            if (payments.size() > 1) {
                log.warn("Multiple payments found with order ID: {} (count: {}). Using the most recent one.", orderId, payments.size());
                
                // Sắp xếp theo thời gian tạo mới nhất và lấy payment đầu tiên
                payments.sort((p1, p2) -> {
                    LocalDateTime time1 = p1.getCreatedAt() != null ? p1.getCreatedAt() : LocalDateTime.MIN;
                    LocalDateTime time2 = p2.getCreatedAt() != null ? p2.getCreatedAt() : LocalDateTime.MIN;
                    return time2.compareTo(time1); // Sắp xếp giảm dần (mới nhất trước)
                });
                
                Payment mostRecentPayment = payments.get(0);
                log.info("Selected payment ID: {} (created at: {}) from {} payments", 
                        mostRecentPayment.getId(), mostRecentPayment.getCreatedAt(), payments.size());
                
                return mostRecentPayment;
            }
            
            // Chỉ có 1 payment
            Payment payment = payments.get(0);
            log.info("Found single payment with ID: {} for order ID: {}", payment.getId(), orderId);
            return payment;
            
        } catch (Exception e) {
            log.error("Error getting payment by order ID: {}", orderId, e);
            throw new RuntimeException("Failed to get payment by order ID: " + e.getMessage());
        }
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
        if (status == null) {
            return paymentRepository.findAll();
        }
        return paymentRepository.findByStatus(status);
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
            if (appointment != null) {
                appointment.setStatus(Appointment.AppointmentStatus.PAYMENT_PENDING);
                appointmentRepository.save(appointment);
                log.info("Payment successful for appointment: {}, updating status to PAYMENT_PENDING", appointment.getId());
            } else {
                log.warn("No appointment found for payment ID: {}", paymentId);
            }
        } else if (status == PaymentStatus.FAILED || status == PaymentStatus.CANCELLED) {
            // Nếu thanh toán thất bại, có thể cập nhật appointment về PENDING_PAYMENT để cho phép thanh toán lại
            Appointment appointment = payment.getAppointment();
            if (appointment != null && appointment.getStatus() == Appointment.AppointmentStatus.PAYMENT_PENDING) {
                appointment.setStatus(Appointment.AppointmentStatus.PENDING_PAYMENT);
                appointmentRepository.save(appointment);
                log.info("Payment failed for appointment: {}, reverting status to PENDING_PAYMENT", appointment.getId());
            }
        }
        
        return paymentRepository.save(payment);
    }
    
    private String generateOrderId(Long appointmentId) {
        // Kiểm tra xem appointment đã có payment chưa
        Optional<Payment> existingPayment = paymentRepository.findByAppointmentId(appointmentId);
        if (existingPayment.isPresent()) {
            Payment payment = existingPayment.get();
            // Nếu payment đã có orderId, sử dụng lại để tránh duplicate
            if (payment.getOrderId() != null && !payment.getOrderId().isEmpty()) {
                log.info("Reusing existing orderId: {} for appointment: {}", payment.getOrderId(), appointmentId);
                return payment.getOrderId();
            }
        }
        
        // Tạo orderId mới nếu chưa có
        String newOrderId = "HC" + System.currentTimeMillis() + "_" + appointmentId;
        log.info("Generated new orderId: {} for appointment: {}", newOrderId, appointmentId);
        return newOrderId;
    }
}
