package com.HealthConnect.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HealthConnect.Model.DoctorSlot;

public interface DoctorSlotRepository extends JpaRepository<DoctorSlot, Long> {
    List<DoctorSlot> findByDoctorId(Long doctorId);
    DoctorSlot findByDoctorIdAndDateAndStartTime(Long doctorId, LocalDate date, LocalTime startTime);
    List<DoctorSlot> findByDoctorIdAndDate(Long doctorId, LocalDate date);
}
