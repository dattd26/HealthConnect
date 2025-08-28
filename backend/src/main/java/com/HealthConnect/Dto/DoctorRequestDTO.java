package com.HealthConnect.Dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class DoctorRequestDTO {
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String license;
    private String hospital;
    private Set<MedicalSpecialtyDTO> specialties;
    private LocalDateTime requestDate;
    private String status; // PENDING, APPROVED, REJECTED
    private String rejectReason;
}
