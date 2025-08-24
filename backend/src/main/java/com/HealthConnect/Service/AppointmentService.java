package com.HealthConnect.Service;

import com.HealthConnect.Dto.AppointmentResponse;
import com.HealthConnect.Dto.DoctorSlotDTO;
import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.DoctorSlot;
import com.HealthConnect.Model.User;
import com.HealthConnect.Repository.AppointmentRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private SlotService slotService;
    
    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Lịch hẹn không tồn tại"));
        
        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        
  
        DoctorSlot slot = appointment.getDoctorSlot();
        slotService.releaseSlot(slot.getDoctor().getId(), slot.getDate(), slot.getStartTime());
        
        appointmentRepository.save(appointment);
    }
    public List<AppointmentResponse> getAppointmentsByUser(User user) {
        List<Appointment> appointments = appointmentRepository.findByPatientOrDoctor(user, user);
        return appointments.stream().map(appointment -> {
            AppointmentResponse response = new AppointmentResponse();
            response.setId(appointment.getId());
            response.setDoctorName(appointment.getDoctor().getFullName());
            response.setDate(appointment.getDoctorSlot().getDate().toString());
            response.setTime(appointment.getDoctorSlot().getStartTime().toString());
            DoctorSlot doctorSlot = appointment.getDoctorSlot();
            DoctorSlotDTO doctorSlotResponse = new DoctorSlotDTO();
            doctorSlotResponse.setDoctorId(doctorSlot.getDoctor().getId());
            doctorSlotResponse.setDate(doctorSlot.getDate());
            doctorSlotResponse.setStartTime(doctorSlot.getStartTime());
            doctorSlotResponse.setEndTime(doctorSlot.getEndTime());
            doctorSlotResponse.setDuration(doctorSlot.getDuration());
            doctorSlotResponse.setStatus(doctorSlot.getStatus().toString());
            response.setDoctorSlot(doctorSlotResponse);
            response.setNotes(appointment.getNotes());
            response.setStatus(appointment.getStatus().toString());
            return response;
        }).collect(Collectors.toList());
    }

    public Appointment getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }
    
    // New methods for doctor dashboard
    public List<Appointment> getTodayAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorIdAndDate(doctorId, LocalDate.now());
    }
    
    public List<Appointment> getUpcomingAppointmentsByDoctor(Long doctorId, int days) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(days);
        return appointmentRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);
    }
    
    public List<Appointment> getAppointmentsByDoctorAndDate(Long doctorId, LocalDate date) {
        return appointmentRepository.findByDoctorIdAndDate(doctorId, date);
    }
    
    public List<Appointment> getAppointmentsByDoctorAndStatus(Long doctorId, String status) {
        Appointment.AppointmentStatus appointmentStatus = Appointment.AppointmentStatus.valueOf(status.toUpperCase());
        return appointmentRepository.findByDoctorIdAndStatus(doctorId, appointmentStatus);
    }

    // Get appointments by doctor and date range
    public List<Appointment> getAppointmentsByDoctorAndDateRange(Long doctorId, LocalDate startDate, LocalDate endDate) {
        return appointmentRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);
    }
    
    // Get all appointments by doctor with details
    public List<Appointment> getAppointmentsByDoctorWithDetails(Long doctorId) {
        return appointmentRepository.findByDoctorIdWithDetails(doctorId);
    }

    // Update appointment status
    public Appointment updateAppointmentStatus(Long appointmentId, String status) {
        Appointment appointment = getAppointmentById(appointmentId);
        appointment.setStatus(Appointment.AppointmentStatus.valueOf(status.toUpperCase()));
        return appointmentRepository.save(appointment);
    }
}