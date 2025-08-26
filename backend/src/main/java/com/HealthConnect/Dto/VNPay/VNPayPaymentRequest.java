package com.HealthConnect.Dto.VNPay;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class VNPayPaymentRequest {
    private Long appointmentId;
    private String orderId;
    private BigDecimal amount;
    private String description;
    private String returnUrl;
    private String cancelUrl;
    private String locale = "vn";
    private String currencyCode = "VND";
    private String paymentMethod = "VNPAY";
}
