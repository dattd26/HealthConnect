package com.HealthConnect.Repository;

import com.HealthConnect.Model.HealthRecord;
import com.HealthConnect.Model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {
    Optional<HealthRecord> findByPatient(Patient patient);
}
