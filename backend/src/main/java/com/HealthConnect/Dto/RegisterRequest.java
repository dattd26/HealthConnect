package com.HealthConnect.Dto;

import jakarta.validation.constraints.*;
import java.util.List;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers and underscores")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be 10-11 digits")
    private String phone;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", 
             message = "Password must contain at least one lowercase letter, one uppercase letter, and one digit")
    private String password;
    
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(PATIENT|DOCTOR|ADMIN)$", message = "Role must be PATIENT, DOCTOR, or ADMIN")
    private String role;

    // Chỉ dành cho DOCTOR
    @AssertTrue(message = "Specialties are required for DOCTOR role")
    public boolean isSpecialtiesValid() {
        if ("DOCTOR".equals(role)) {
            return specialties != null && !specialties.isEmpty();
        }
        return true;
    }
    
    private List<SpecialtyRequest> specialties;
    
    // Chỉ dành cho DOCTOR
    @AssertTrue(message = "License is required for DOCTOR role")
    public boolean isLicenseValid() {
        if ("DOCTOR".equals(role)) {
            return license != null && !license.trim().isEmpty();
        }
        return true;
    }
    
    @Size(max = 50, message = "License number cannot exceed 50 characters")
    private String license;
}
