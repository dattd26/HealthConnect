package com.HealthConnect.Service;

import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.DoctorSlot;
import com.HealthConnect.Model.User;
import com.HealthConnect.Repository.AppointmentRepository;
import com.HealthConnect.Repository.DoctorSlotRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private DoctorSlotRepository doctorSlotRepository;
    
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
        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        DoctorSlot slot = appointment.getDoctorSlot();
        slot.setStatus(DoctorSlot.SlotStatus.AVAILABLE);
        doctorSlotRepository.save(slot);
        appointmentRepository.save(appointment);
    }
    public List<Appointment> getAppointmentsByUser(User user) {
        // Find appointments where user is either patient or doctor
        return appointmentRepository.findByPatientOrDoctor(user, user);
    }

    
}