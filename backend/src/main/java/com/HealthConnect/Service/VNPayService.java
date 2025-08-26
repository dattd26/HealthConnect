package com.HealthConnect.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthConnect.Config.VNPayConfig;
import com.HealthConnect.Dto.VNPay.VNPayPaymentRequest;
import com.HealthConnect.Dto.VNPay.VNPayPaymentResponse;
import com.HealthConnect.Dto.VNPay.VNPayCallbackRequest;
import com.HealthConnect.Dto.VNPay.VNPayCallbackResponse;
import com.HealthConnect.Model.Payment;
import com.HealthConnect.Model.Payment.PaymentStatus;
import com.HealthConnect.Model.Payment.PaymentMethod;
import com.HealthConnect.Repository.PaymentRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class VNPayService {
    
    @Autowired
    private VNPayConfig vnpayConfig;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    public VNPayPaymentResponse createPaymentUrl(VNPayPaymentRequest request) {
        try {
            log.info("Creating VNPay payment URL for request: {}", request);
            
            String vnp_Version   = vnpayConfig.getVersion();      // 2.1.0
            String vnp_Command   = vnpayConfig.getCommand();      // pay
            String vnp_TmnCode   = vnpayConfig.getTmnCode();
            String vnp_HashSecret= vnpayConfig.getHashSecret();
            String vnp_Url       = vnpayConfig.getPaymentUrl();   // https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
            
            // Use returnUrl from request instead of config
            String vnp_ReturnUrl = request.getReturnUrl();
            if (vnp_ReturnUrl == null || vnp_ReturnUrl.isEmpty()) {
                vnp_ReturnUrl = vnpayConfig.getReturnUrl();
            }
    
            String vnp_TxnRef    = generateTxnRef();
            String vnp_OrderInfo = request.getDescription();      // Ví dụ: "Thanh toán lịch hẹn - 6"
            String vnp_OrderType = "billpayment";
            String vnp_Amount    = String.valueOf(request.getAmount().longValue() * 100); // VND * 100
            String vnp_Locale    = vnpayConfig.getLocale();       // vn
            String vnp_CurrCode  = vnpayConfig.getCurrencyCode(); // VND
            String vnp_IpAddr    = "127.0.0.1";
            String vnp_CreateDate= LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    
            log.info("VNPay parameters - TmnCode: {}, ReturnUrl: {}, Amount: {}, OrderInfo: {}", 
                    vnp_TmnCode, vnp_ReturnUrl, vnp_Amount, vnp_OrderInfo);
    
            // Dùng TreeMap để tự sort key tăng dần
            Map<String, String> vnp_Params = new TreeMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", vnp_Amount);
            vnp_Params.put("vnp_CurrCode", vnp_CurrCode);
            vnp_Params.put("vnp_Locale", vnp_Locale);
            vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.put("vnp_OrderType", vnp_OrderType);
            vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
    
            StringBuilder dataToSign = new StringBuilder();
            StringBuilder query = new StringBuilder();
            for (Map.Entry<String, String> e : vnp_Params.entrySet()) {
                String k = e.getKey();
                String v = e.getValue();
                if (v == null || v.isEmpty()) continue;
    
                String encK = URLEncoder.encode(k, StandardCharsets.UTF_8.toString());
                String encV = URLEncoder.encode(v, StandardCharsets.UTF_8.toString());
    
                if (dataToSign.length() > 0) dataToSign.append('&');
                dataToSign.append(encK).append('=').append(encV);
    
                if (query.length() > 0) query.append('&');
                query.append(encK).append('=').append(encV);
            }
    
            String vnp_SecureHash = hmacSHA512(vnp_HashSecret, dataToSign.toString());
            query.append("&vnp_SecureHash=").append(vnp_SecureHash);
    
            String paymentUrl = vnp_Url + "?" + query;
            log.info("VNPay dataToSign: {}", dataToSign);
            log.info("VNPay payment URL: {}", paymentUrl);
    
            VNPayPaymentResponse res = new VNPayPaymentResponse();
            res.setPaymentUrl(paymentUrl);
            res.setOrderId(request.getOrderId());
            res.setVnpayTxnRef(vnp_TxnRef);
            res.setStatus("SUCCESS");
            res.setMessage("Payment URL created successfully");
            return res;
    
        } catch (Exception e) {
            log.error("Error creating VNPay payment URL: ", e);
            VNPayPaymentResponse res = new VNPayPaymentResponse();
            res.setStatus("ERROR");
            res.setMessage("Failed to create payment URL: " + e.getMessage());
            return res;
        }
    }
    
    
    public VNPayCallbackResponse processCallback(VNPayCallbackRequest callbackRequest) {
        VNPayCallbackResponse response = new VNPayCallbackResponse();
        
        try {
            log.info("Processing VNPay callback for TxnRef: {}", callbackRequest.getVnp_TxnRef());
            log.info("Response Code: {}, Transaction Status: {}", 
                    callbackRequest.getVnp_ResponseCode(), callbackRequest.getVnp_TransactionStatus());
            
            // Verify secure hash
            if (!verifySecureHash(callbackRequest)) {
                log.warn("Invalid secure hash for transaction: {}", callbackRequest.getVnp_TxnRef());
                response.setStatus("FAILED");
                response.setMessage("Invalid secure hash");
                return response;
            }
            
            // Process the callback
            String responseCode = callbackRequest.getVnp_ResponseCode();
            String transactionStatus = callbackRequest.getVnp_TransactionStatus();
            
            response.setOrderId(callbackRequest.getVnp_OrderInfo());
            response.setVnpayTxnRef(callbackRequest.getVnp_TxnRef());
            response.setAmount(callbackRequest.getVnp_Amount());
            response.setBankCode(callbackRequest.getVnp_BankCode());
            response.setBankTranNo(callbackRequest.getVnp_BankTranNo());
            response.setCardType(callbackRequest.getVnp_CardType());
            response.setPayDate(callbackRequest.getVnp_PayDate());
            response.setTransactionNo(callbackRequest.getVnp_TransactionNo());
            
            if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
                log.info("Payment successful for transaction: {}", callbackRequest.getVnp_TxnRef());
                response.setStatus("SUCCESS");
                response.setMessage("Payment successful");
                
                // Update payment status in database
                updatePaymentStatus(callbackRequest);
            } else {
                log.warn("Payment failed for transaction: {} with response code: {}", 
                        callbackRequest.getVnp_TxnRef(), responseCode);
                response.setStatus("FAILED");
                response.setMessage("Payment failed: " + responseCode);
                
                // Update payment status even for failed payments
                updatePaymentStatus(callbackRequest);
            }
            
        } catch (Exception e) {
            log.error("Error processing VNPay callback: ", e);
            response.setStatus("ERROR");
            response.setMessage("Error processing callback: " + e.getMessage());
        }
        
        return response;
    }
    
    private String generateTxnRef() {
        return "VNPAY" + System.currentTimeMillis();
    }
    
    private String hmacSHA512(String key, String data) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA512");
            javax.crypto.spec.SecretKeySpec secretKeySpec = new javax.crypto.spec.SecretKeySpec(
                key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKeySpec);
            
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            log.error("Error generating HMAC-SHA512: ", e);
            throw new RuntimeException("Failed to generate HMAC-SHA512 hash", e);
        }
    }
    
    private boolean verifySecureHash(VNPayCallbackRequest callbackRequest) {
        try {
            log.info("Verifying secure hash for transaction: {}", callbackRequest.getVnp_TxnRef());
            
            // Create a map of all parameters except vnp_SecureHash
            Map<String, String> vnp_Params = new TreeMap<>();
            vnp_Params.put("vnp_Amount", callbackRequest.getVnp_Amount());
            vnp_Params.put("vnp_BankCode", callbackRequest.getVnp_BankCode());
            vnp_Params.put("vnp_BankTranNo", callbackRequest.getVnp_BankTranNo());
            vnp_Params.put("vnp_CardType", callbackRequest.getVnp_CardType());
            vnp_Params.put("vnp_OrderInfo", callbackRequest.getVnp_OrderInfo());
            vnp_Params.put("vnp_PayDate", callbackRequest.getVnp_PayDate());
            vnp_Params.put("vnp_ResponseCode", callbackRequest.getVnp_ResponseCode());
            vnp_Params.put("vnp_TmnCode", callbackRequest.getVnp_TmnCode());
            vnp_Params.put("vnp_TransactionNo", callbackRequest.getVnp_TransactionNo());
            vnp_Params.put("vnp_TransactionStatus", callbackRequest.getVnp_TransactionStatus());
            vnp_Params.put("vnp_TxnRef", callbackRequest.getVnp_TxnRef());
            
            // Build data string for signing
            StringBuilder dataToSign = new StringBuilder();
            for (Map.Entry<String, String> e : vnp_Params.entrySet()) {
                String k = e.getKey();
                String v = e.getValue();
                if (v == null || v.isEmpty()) continue;
                
                String encK = URLEncoder.encode(k, StandardCharsets.UTF_8.toString());
                String encV = URLEncoder.encode(v, StandardCharsets.UTF_8.toString());
                
                if (dataToSign.length() > 0) dataToSign.append('&');
                dataToSign.append(encK).append('=').append(encV);
            }
            
            // Generate hash
            String expectedHash = hmacSHA512(vnpayConfig.getHashSecret(), dataToSign.toString());
            String receivedHash = callbackRequest.getVnp_SecureHash();
            
            log.info("Expected hash: {}", expectedHash);
            log.info("Received hash: {}", receivedHash);
            
            boolean isValid = expectedHash.equals(receivedHash);
            log.info("Hash verification result: {}", isValid);
            
            return isValid;
            
        } catch (Exception e) {
            log.error("Error verifying secure hash: ", e);
            return false;
        }
    }
    
    private void updatePaymentStatus(VNPayCallbackRequest callbackRequest) {
        try {
            log.info("Updating payment status for VNPay transaction: {}", callbackRequest.getVnp_TxnRef());
            
            // Find payment by VNPay transaction reference
            Payment payment = paymentRepository.findByVnpayTxnRef(callbackRequest.getVnp_TxnRef())
                    .orElse(null);
            
            if (payment != null) {
                log.info("Found payment with ID: {} for transaction: {}", payment.getId(), callbackRequest.getVnp_TxnRef());
                
                if ("00".equals(callbackRequest.getVnp_TransactionStatus())) {
                    payment.setStatus(PaymentStatus.SUCCESS);
                    payment.setVnpayTransactionId(callbackRequest.getVnp_TransactionNo());
                    payment.setVnpayResponseCode(callbackRequest.getVnp_ResponseCode());
                    payment.setVnpayResponseMessage("Payment successful");
                    payment.setPaymentDate(LocalDateTime.now());
                    log.info("Updated payment status to SUCCESS for payment ID: {}", payment.getId());
                } else {
                    payment.setStatus(PaymentStatus.FAILED);
                    payment.setVnpayResponseCode(callbackRequest.getVnp_ResponseCode());
                    payment.setVnpayResponseMessage("Payment failed with code: " + callbackRequest.getVnp_ResponseCode());
                    log.info("Updated payment status to FAILED for payment ID: {} with response code: {}", 
                            payment.getId(), callbackRequest.getVnp_ResponseCode());
                }
                
                paymentRepository.save(payment);
                log.info("Payment status updated successfully for payment ID: {}", payment.getId());
            } else {
                log.warn("No payment found for VNPay transaction reference: {}", callbackRequest.getVnp_TxnRef());
            }
        } catch (Exception e) {
            log.error("Error updating payment status: ", e);
        }
    }
}
