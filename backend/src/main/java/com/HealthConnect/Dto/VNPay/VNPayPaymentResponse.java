package com.HealthConnect.Dto.VNPay;

import lombok.Data;

@Data
public class VNPayPaymentResponse {
    private String paymentUrl;
    private String orderId;
    private String vnpayTxnRef;
    private String status;
    private String message;
}
