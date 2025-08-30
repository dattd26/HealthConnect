package com.HealthConnect.Factory;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.HealthConnect.Dto.RegisterRequest;
import com.HealthConnect.Dto.SpecialtyRequest;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.MedicalSpecialty;
import com.HealthConnect.Model.Patient;
import com.HealthConnect.Model.User;
import com.HealthConnect.Service.MedicalSpecialtyService;

@Component
public class UserFactoryImpl implements UserFactory {
    @Autowired
    private MedicalSpecialtyService specialtyService;
    
    @Override
    public User createUser(RegisterRequest request, PasswordEncoder passwordEncoder) {
        String role = request.getRole();
        if (role == null) {
            throw new IllegalArgumentException("Role must not be null");
        }
        switch (role) {
            case "DOCTOR":
                return buildDoctor(request, passwordEncoder);
            case "PATIENT":
                return buidPatient(request, passwordEncoder);
            default:
                throw new IllegalArgumentException("Unsupported role: " + role);
        }
    }
    private void populateCommonFields(User u, RegisterRequest r, PasswordEncoder passwordEncoder) {
        u.setFullName(r.getFullName());
        u.setUsername(r.getUsername());
        u.setPassword(passwordEncoder.encode(r.getPassword()));
        u.setEmail(r.getEmail());
        u.setPhone(r.getPhone());
        u.setRole(r.getRole().toUpperCase());
        u.setVerified(false);
    }
    private Doctor buildDoctor(RegisterRequest req, PasswordEncoder passwordEncoder) {
        Doctor d = new Doctor();
        System.out.println("Building doctor with specialties: " + req.getSpecialties());
        populateCommonFields(d, req, passwordEncoder);
        d.setLicense(req.getLicense()); 
        
        Set<MedicalSpecialty> specialties = new HashSet<MedicalSpecialty>();
        
        // Kiểm tra specialties không null và không rỗng
        if (req.getSpecialties() != null && !req.getSpecialties().isEmpty()) {
            for (SpecialtyRequest s : req.getSpecialties()) {
                if (s.getCode() != null && !s.getCode().trim().isEmpty()) {
                    MedicalSpecialty specialty = specialtyService.findByCode(s.getCode());
                    if (specialty != null) {
                        specialties.add(specialty);
                    } else {
                        System.out.println("Warning: Specialty with code '" + s.getCode() + "' not found");
                    }
                }
            }
        }
        
        d.setSpecialties(specialties);
        d.setVerified(false);
        return d;
    }
    private Patient buidPatient(RegisterRequest req, PasswordEncoder passwordEncoder) {
        Patient p = new Patient();
        populateCommonFields(p, req, passwordEncoder);
        return p;
    }
    
}
