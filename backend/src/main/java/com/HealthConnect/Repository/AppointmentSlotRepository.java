package com.HealthConnect.Repository;

import com.HealthConnect.Model.AppointmentSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot, Long> {
    List<AppointmentSlot> findByDoctorIdAndDateBetween(Long doctorId, LocalDate startDate, LocalDate endDate);
    List<AppointmentSlot> findByDoctorIdAndDateAndStartTime(Long doctorId, LocalDate date, LocalTime startTime);
} 