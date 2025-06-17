package com.HealthConnect.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthConnect.Model.Patient;
import com.HealthConnect.Repository.PatientRepository;


@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepository;

    public Patient getById(Long id) {
        return patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
    }
    public Patient getByUsername(String username) {
        return patientRepository.findByUsername(username);
    }
}
