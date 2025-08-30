package com.HealthConnect.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HealthConnect.Model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findByUsername(String username);
}
