package com.HealthConnect.Model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Table(name = "users")
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {
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

    private boolean isVerified = false;
}