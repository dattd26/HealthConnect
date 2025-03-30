package com.HealthConnect.Service;

import com.HealthConnect.Model.User;
import com.HealthConnect.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        user.setPassword(encodePassword(user.getPassword()));
        return userRepository.save(user);
    }
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }
    private String encodePassword(String password) {
        return new BCryptPasswordEncoder().encode(password);
    }
    public boolean checkExistsEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    public List<User> getAllDoctors() {
        return userRepository.findAllByRole("DOCTOR");
    }
    public User getUserProfile(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }
}