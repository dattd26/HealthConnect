package com.HealthConnect.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDTO {
    private Long id;
    private String fullName;
    private String username;
    private LocalDate dateOfBirth;
    private String address;
    private String email;
    private String phone;
    private String gender;
    private String role;
    private boolean isVerified;
    private boolean isBlocked;
    private String department;
    private String permissions;
}
