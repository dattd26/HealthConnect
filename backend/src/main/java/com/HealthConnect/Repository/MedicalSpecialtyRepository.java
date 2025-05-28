package com.HealthConnect.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthConnect.Model.MedicalSpecialty;

@Repository
public interface MedicalSpecialtyRepository extends JpaRepository<MedicalSpecialty, Long> {
    MedicalSpecialty findByName(String name);
    MedicalSpecialty findByCode(String code);
}
