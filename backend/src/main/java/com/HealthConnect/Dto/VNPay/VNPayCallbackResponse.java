package com.HealthConnect.Dto.VNPay;

import lombok.Data;

@Data
public class VNPayCallbackResponse {
    private String orderId;
    private String vnpayTxnRef;
    private String status;
    private String message;
    private String amount;
    private String bankCode;
    private String bankTranNo;
    private String cardType;
    private String payDate;
    private String transactionNo;
}
