package com.HealthConnect.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.DoctorTimeslot;

public interface DoctorTimeSlotRepository extends JpaRepository<DoctorTimeslot, Long> {
    List<DoctorTimeslot> findByDoctor(Doctor doctor);
}
