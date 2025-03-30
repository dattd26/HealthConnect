package com.HealthConnect.Service;

import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.User;
import com.HealthConnect.Repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Lịch hẹn không tồn tại"));
        appointment.setStatus("CANCELLED");
        appointmentRepository.save(appointment);
    }
    public List<Appointment> getAppointmentsByUser(User user) {
        // Find appointments where user is either patient or doctor
        return appointmentRepository.findByPatientOrDoctor(user, user);
    }
}