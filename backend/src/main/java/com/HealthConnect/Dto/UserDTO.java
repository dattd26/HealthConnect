package com.HealthConnect.Dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String gender;
    private String fullName;
    private LocalDate dateOfBirth;
    private String username;
    private String email;
    private String role;


    private String phone;
    private String address;
    private boolean isVerified;
}
