package com.HealthConnect.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.HealthConnect.Dto.VNPay.VNPayPaymentRequest;
import com.HealthConnect.Dto.VNPay.VNPayPaymentResponse;
import com.HealthConnect.Dto.VNPay.VNPayCallbackRequest;
import com.HealthConnect.Dto.VNPay.VNPayCallbackResponse;
import com.HealthConnect.Service.VNPayService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/vnpay")
@CrossOrigin(origins = "*")
public class VNPayController {
    
    @Autowired
    private VNPayService vnpayService;
    
    @PostMapping("/create-payment")
    public ResponseEntity<VNPayPaymentResponse> createPayment(@RequestBody VNPayPaymentRequest request) {
        try {
            log.info("Creating VNPay payment for appointment: {}", request.getAppointmentId());
            VNPayPaymentResponse response = vnpayService.createPaymentUrl(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating VNPay payment: ", e);
            VNPayPaymentResponse errorResponse = new VNPayPaymentResponse();
            errorResponse.setStatus("ERROR");
            errorResponse.setMessage("Failed to create payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/callback")
    public ResponseEntity<VNPayCallbackResponse> paymentCallback(
            @RequestParam("vnp_Amount") String vnp_Amount,
            @RequestParam("vnp_BankCode") String vnp_BankCode,
            @RequestParam("vnp_BankTranNo") String vnp_BankTranNo,
            @RequestParam("vnp_CardType") String vnp_CardType,
            @RequestParam("vnp_OrderInfo") String vnp_OrderInfo,
            @RequestParam("vnp_PayDate") String vnp_PayDate,
            @RequestParam("vnp_ResponseCode") String vnp_ResponseCode,
            @RequestParam("vnp_TmnCode") String vnp_TmnCode,
            @RequestParam("vnp_TransactionNo") String vnp_TransactionNo,
            @RequestParam("vnp_TransactionStatus") String vnp_TransactionStatus,
            @RequestParam("vnp_TxnRef") String vnp_TxnRef,
            @RequestParam("vnp_SecureHash") String vnp_SecureHash) {
        
        try {
            log.info("Received VNPay callback for transaction: {}", vnp_TxnRef);
            log.info("Response Code: {}, Transaction Status: {}", vnp_ResponseCode, vnp_TransactionStatus);
            
            VNPayCallbackRequest callbackRequest = new VNPayCallbackRequest();
            callbackRequest.setVnp_Amount(vnp_Amount);
            callbackRequest.setVnp_BankCode(vnp_BankCode);
            callbackRequest.setVnp_BankTranNo(vnp_BankTranNo);
            callbackRequest.setVnp_CardType(vnp_CardType);
            callbackRequest.setVnp_OrderInfo(vnp_OrderInfo);
            callbackRequest.setVnp_PayDate(vnp_PayDate);
            callbackRequest.setVnp_ResponseCode(vnp_ResponseCode);
            callbackRequest.setVnp_TmnCode(vnp_TmnCode);
            callbackRequest.setVnp_TransactionNo(vnp_TransactionNo);
            callbackRequest.setVnp_TransactionStatus(vnp_TransactionStatus);
            callbackRequest.setVnp_TxnRef(vnp_TxnRef);
            callbackRequest.setVnp_SecureHash(vnp_SecureHash);
            
            VNPayCallbackResponse response = vnpayService.processCallback(callbackRequest);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error processing VNPay callback: ", e);
            VNPayCallbackResponse errorResponse = new VNPayCallbackResponse();
            errorResponse.setStatus("ERROR");
            errorResponse.setMessage("Error processing callback: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/return")
    public ResponseEntity<?> paymentReturn(
            @RequestParam("vnp_Amount") String vnp_Amount,
            @RequestParam("vnp_BankCode") String vnp_BankCode,
            @RequestParam("vnp_BankTranNo") String vnp_BankTranNo,
            @RequestParam("vnp_CardType") String vnp_CardType,
            @RequestParam("vnp_OrderInfo") String vnp_OrderInfo,
            @RequestParam("vnp_PayDate") String vnp_PayDate,
            @RequestParam("vnp_ResponseCode") String vnp_ResponseCode,
            @RequestParam("vnp_TmnCode") String vnp_TmnCode,
            @RequestParam("vnp_TransactionNo") String vnp_TransactionNo,
            @RequestParam("vnp_TransactionStatus") String vnp_TransactionStatus,
            @RequestParam("vnp_TxnRef") String vnp_TxnRef,
            @RequestParam("vnp_SecureHash") String vnp_SecureHash,
            @RequestParam(value = "orderId", required = false) String orderId) {
        
        try {
            log.info("Received VNPay return for transaction: {}", vnp_TxnRef);
            log.info("Response Code: {}, Transaction Status: {}, OrderId: {}", vnp_ResponseCode, vnp_TransactionStatus, orderId);
            
            // Process the return data
            VNPayCallbackRequest callbackRequest = new VNPayCallbackRequest();
            callbackRequest.setVnp_Amount(vnp_Amount);
            callbackRequest.setVnp_BankCode(vnp_BankCode);
            callbackRequest.setVnp_BankTranNo(vnp_BankTranNo);
            callbackRequest.setVnp_CardType(vnp_CardType);
            callbackRequest.setVnp_OrderInfo(vnp_OrderInfo);
            callbackRequest.setVnp_PayDate(vnp_PayDate);
            callbackRequest.setVnp_ResponseCode(vnp_ResponseCode);
            callbackRequest.setVnp_TmnCode(vnp_TmnCode);
            callbackRequest.setVnp_TransactionNo(vnp_TransactionNo);
            callbackRequest.setVnp_TransactionStatus(vnp_TransactionStatus);
            callbackRequest.setVnp_TxnRef(vnp_TxnRef);
            callbackRequest.setVnp_SecureHash(vnp_SecureHash);
            
            VNPayCallbackResponse response = vnpayService.processCallback(callbackRequest);
            
            // Return HTML response for redirect
            String htmlResponse;
            if ("00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus)) {
                // Success - redirect to success page
                htmlResponse = String.format(
                    "<html><head><title>Payment Success</title></head>" +
                    "<body><script>window.location.href='http://localhost:3000/payment-success?orderId=%s&status=success';</script>" +
                    "<p>Payment successful! Redirecting...</p></body></html>",
                    orderId != null ? orderId : ""
                );
            } else {
                // Failed or cancelled - redirect to cancel page
                htmlResponse = String.format(
                    "<html><head><title>Payment Failed</title></head>" +
                    "<body><script>window.location.href='http://localhost:3000/payment-cancel?orderId=%s&status=failed&code=%s';</script>" +
                    "<p>Payment failed! Redirecting...</p></body></html>",
                    orderId != null ? orderId : "",
                    vnp_ResponseCode
                );
            }
            
            return ResponseEntity.ok()
                .header("Content-Type", "text/html;charset=UTF-8")
                .body(htmlResponse);
            
        } catch (Exception e) {
            log.error("Error processing VNPay return: ", e);
            String htmlResponse = String.format(
                "<html><head><title>Error</title></head>" +
                "<body><script>window.location.href='http://localhost:3000/payment-cancel?orderId=%s&status=error';</script>" +
                "<p>Error processing payment! Redirecting...</p></body></html>",
                orderId != null ? orderId : ""
            );
            return ResponseEntity.ok()
                .header("Content-Type", "text/html;charset=UTF-8")
                .body(htmlResponse);
        }
    }
    
    @GetMapping("/payment-status/{orderId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String orderId) {
        try {
            // Implementation to get payment status
            return ResponseEntity.ok().body("Payment status retrieved for order: " + orderId);
        } catch (Exception e) {
            log.error("Error getting payment status: ", e);
            return ResponseEntity.badRequest().body("Error retrieving payment status: " + e.getMessage());
        }
    }
}
