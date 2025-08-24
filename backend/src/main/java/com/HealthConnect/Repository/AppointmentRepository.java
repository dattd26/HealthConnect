package com.HealthConnect.Repository;


import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId); 
    List<Appointment> findByPatientOrDoctor(User patient, User doctor);
    
    // New methods for doctor dashboard with patient data
    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient JOIN FETCH a.doctor JOIN FETCH a.doctorSlot WHERE a.doctor.id = :doctorId AND a.doctorSlot.date = :date")
    List<Appointment> findByDoctorIdAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient JOIN FETCH a.doctor JOIN FETCH a.doctorSlot WHERE a.doctor.id = :doctorId AND a.doctorSlot.date BETWEEN :startDate AND :endDate")
    List<Appointment> findByDoctorIdAndDateBetween(@Param("doctorId") Long doctorId, 
                                                  @Param("startDate") LocalDate startDate, 
                                                  @Param("endDate") LocalDate endDate);
    
    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient JOIN FETCH a.doctor JOIN FETCH a.doctorSlot WHERE a.doctor.id = :doctorId AND a.status = :status")
    List<Appointment> findByDoctorIdAndStatus(@Param("doctorId") Long doctorId, Appointment.AppointmentStatus status);
    
    // Basic methods with fetch joins
    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient JOIN FETCH a.doctor JOIN FETCH a.doctorSlot WHERE a.doctor.id = :doctorId")
    List<Appointment> findByDoctorIdWithDetails(@Param("doctorId") Long doctorId);
}