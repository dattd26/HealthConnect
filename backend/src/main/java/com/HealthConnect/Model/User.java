package com.HealthConnect.Model;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Table(name = "users")
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String username;
    private Date dateOfBirth;
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