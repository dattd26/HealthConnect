package com.HealthConnect.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "admins")
public class Admin extends User {
    
    private String department;
    private String permissions;
    
    // Constructor mặc định
    public Admin() {
        super();
    }
    
    // Constructor với tham số
    public Admin(String fullName, String username, String email, String phone, String password) {
        setFullName(fullName);
        setUsername(username);
        setEmail(email);
        setPhone(phone);
        setPassword(password);
        setRole("ADMIN");
        setVerified(true);
        setBlocked(false);
    }
}
