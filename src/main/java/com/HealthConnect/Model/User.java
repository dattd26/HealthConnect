package com.HealthConnect.Model;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Table(name = "users")
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String password;
    private String role; // PATIENT, DOCTOR, ADMIN

    private String specialty;
    private String license;
    private boolean isVerified; // Admin xác thực

}