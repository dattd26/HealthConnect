package com.HealthConnect.Factory;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.HealthConnect.Dto.RegisterRequest;
import com.HealthConnect.Model.User;

public interface UserFactory {
    User createUser(RegisterRequest request, PasswordEncoder passwordEncoder);
}
