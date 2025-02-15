package com.HealthConnect.Repository;


import com.HealthConnect.Model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId); // Lấy lịch hẹn theo bệnh nhân
    List<Appointment> findByDoctorId(Long doctorId);   // Lấy lịch hẹn theo bác sĩ
}