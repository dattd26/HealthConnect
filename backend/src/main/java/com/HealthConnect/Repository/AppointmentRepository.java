package com.HealthConnect.Repository;


import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId); 
    List<Appointment> findByPatientOrDoctor(User patient, User doctor);
}