package com.HealthConnect.Service;

import com.HealthConnect.Dto.AppointmentResponse;
import com.HealthConnect.Dto.DoctorResponse;
import com.HealthConnect.Dto.DoctorSlotDTO;
import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.DoctorSlot;
import com.HealthConnect.Model.User;
import com.HealthConnect.Repository.AppointmentRepository;
import com.HealthConnect.Repository.DoctorSlotRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    
}