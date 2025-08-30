package com.HealthConnect.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthConnect.Model.MedicalSpecialty;
import com.HealthConnect.Repository.MedicalSpecialtyRepository;

@Service
public class MedicalSpecialtyService {
    @Autowired
    private MedicalSpecialtyRepository medicalSpecialtyRepository;
    
    public MedicalSpecialty saveSpecialty(MedicalSpecialty specialty) {
        return medicalSpecialtyRepository.save(specialty);
    }
    public MedicalSpecialty findByName(String name) {
        return medicalSpecialtyRepository.findByName(name);
    }
    public MedicalSpecialty findByCode(String code) {
        return medicalSpecialtyRepository.findByCode(code);
    }
    public List<MedicalSpecialty> getAllSpecialties() {
        return medicalSpecialtyRepository.findAll();
    }
}
