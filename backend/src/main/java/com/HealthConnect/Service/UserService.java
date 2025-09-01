package com.HealthConnect.Service;

import com.HealthConnect.Dto.UserDTO;
import com.HealthConnect.Model.User;
import com.HealthConnect.Repository.UserRepository;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public boolean checkExistsEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    public User getUserProfile(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }
    public User updateBasicInfo(Long userId, String address, LocalDate dateOfBirth, String email, String fullName, String gender, String phone) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setAddress(address);
        user.setDateOfBirth(dateOfBirth);
        user.setEmail(email);
        user.setFullName(fullName);
        user.setGender(gender);
        user.setPhone(phone);
        return userRepository.save(user);
    }
}