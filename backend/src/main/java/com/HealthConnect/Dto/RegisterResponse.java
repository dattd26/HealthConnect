package com.HealthConnect.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegisterResponse {
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String role;
    private boolean isVerified;
    private String message;
}
