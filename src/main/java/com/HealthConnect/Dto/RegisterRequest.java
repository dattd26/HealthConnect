package com.HealthConnect.Dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String password;
    private String role; // PATIENT, DOCTOR, ADMIN

    private String specialty; // Chỉ dành cho DOCTOR
    private String license;   // Chỉ dành cho DOCTOR
}
