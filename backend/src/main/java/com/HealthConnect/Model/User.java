package com.HealthConnect.Model;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDate;

@Data
@Table(name = "users")
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String username;
    private LocalDate dateOfBirth;
    private String address;
    private String email;
    private String phone;
    private String gender;
    private String password;
    private String role; // PATIENT, DOCTOR, ADMIN

    private String specialty;
    private String license;
    private boolean isVerified; // Admin xác thực

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private HealthRecord healthRecord;
}