package com.HealthConnect.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.HealthConnect.Model.DoctorSlot;

public interface DoctorSlotRepository extends JpaRepository<DoctorSlot, Long> {
    List<DoctorSlot> findByDoctorId(Long doctorId);
    DoctorSlot findByDoctorIdAndDateAndStartTime(Long doctorId, LocalDate date, LocalTime startTime);
    List<DoctorSlot> findByDoctorIdAndDate(Long doctorId, LocalDate date);
    
    // New optimized methods for slot management
    List<DoctorSlot> findByDoctorIdAndDateBetween(Long doctorId, LocalDate startDate, LocalDate endDate);
    
    @Modifying
    @Query("DELETE FROM DoctorSlot ds WHERE ds.doctor.id = :doctorId AND ds.date BETWEEN :startDate AND :endDate AND ds.status = :status")
    void deleteByDoctorIdAndDateBetweenAndStatus(@Param("doctorId") Long doctorId, 
                                               @Param("startDate") LocalDate startDate, 
                                               @Param("endDate") LocalDate endDate, 
                                               @Param("status") DoctorSlot.SlotStatus status);
    
    @Query("SELECT ds FROM DoctorSlot ds WHERE ds.doctor.id = :doctorId AND ds.date = :date AND ds.status = 'AVAILABLE' ORDER BY ds.startTime")
    List<DoctorSlot> findAvailableSlotsByDoctorAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
    
    @Query("SELECT COUNT(ds) FROM DoctorSlot ds WHERE ds.doctor.id = :doctorId AND ds.date BETWEEN :startDate AND :endDate AND ds.status = 'AVAILABLE'")
    long countAvailableSlotsByDoctorAndDateRange(@Param("doctorId") Long doctorId, 
                                               @Param("startDate") LocalDate startDate, 
                                               @Param("endDate") LocalDate endDate);


}
