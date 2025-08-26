package com.HealthConnect.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Data
@Configuration
public class VNPayConfig {
    
    @Value("${vnpay.tmn-code}")
    private String tmnCode;
    
    @Value("${vnpay.hash-secret}")
    private String hashSecret;
    
    @Value("${vnpay.payment-url}")
    private String paymentUrl;
    
    @Value("${vnpay.return-url}")
    private String returnUrl;
    
    @Value("${vnpay.cancel-url}")
    private String cancelUrl;
    
    @Value("${vnpay.api-url}")
    private String apiUrl;
    
    @Value("${vnpay.version}")
    private String version = "2.1.0";
    
    @Value("${vnpay.command}")
    private String command = "pay";
    
    @Value("${vnpay.locale}")
    private String locale = "vn";
    
    @Value("${vnpay.currency-code}")
    private String currencyCode = "VND";
}
