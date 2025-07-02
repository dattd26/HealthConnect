package com.HealthConnect.Controller;

import com.HealthConnect.Dto.AppointmentRequest;
import com.HealthConnect.Dto.AppointmentResponse;
import com.HealthConnect.Dto.DoctorResponse;
import com.HealthConnect.Dto.DoctorSlotDTO;
import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.DoctorSlot;
import com.HealthConnect.Model.User;
import com.HealthConnect.Service.AppointmentService;
import com.HealthConnect.Service.DoctorService;
import com.HealthConnect.Service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private DoctorService doctorService;
    @Autowired
    private PatientService patientService;
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByPatient(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByPatient(patientId);
        List<AppointmentResponse> appointmentResponses = appointments.stream()
            .map(appointment -> {
                AppointmentResponse response = new AppointmentResponse();
                response.setId(appointment.getId());
                response.setDate(appointment.getDoctorSlot().getDate().toString());
                response.setTime(appointment.getDoctorSlot().getStartTime().toString());
                response.setStatus(appointment.getStatus().toString());
                response.setNotes(appointment.getNotes());
                response.setDoctorName(appointment.getDoctor().getFullName());
                response.setDoctorSlot(new DoctorSlotDTO(appointment.getDoctorSlot().getId(), appointment.getDoctorSlot().getDate(),
                appointment.getDoctorSlot().getStartTime(), appointment.getDoctorSlot().getEndTime(), appointment.getDoctorSlot().getDuration(), appointment.getDoctorSlot().getStatus().toString()));
                return response;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(appointmentResponses);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctor(doctorId);
        return ResponseEntity.ok(appointments);
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@AuthenticationPrincipal UserDetails userDetails, @RequestBody AppointmentRequest request) {
        try {
            DoctorSlot slot = doctorService.getSlotByDoctorIdAndDateAndStartTime(request.getDoctorId(), request.getDate(), request.getStartTime());
            if (slot == null) {
                throw new RuntimeException("Slot not found");
            }
            if (slot.getStatus() != DoctorSlot.SlotStatus.AVAILABLE) {
                throw new RuntimeException("Slot is not available");
            }
            slot.setStatus(DoctorSlot.SlotStatus.BOOKED);
            Appointment newAppointment = new Appointment();
            newAppointment.setDoctor(doctorService.getById(request.getDoctorId()));
            newAppointment.setDoctorSlot(slot);
            newAppointment.setPatient(patientService.getByUsername(userDetails.getUsername()));
            newAppointment.setStatus(Appointment.AppointmentStatus.WAITING);
            newAppointment.setNotes(request.getNotes());
            appointmentService.createAppointment(newAppointment);
            AppointmentResponse response = new AppointmentResponse();
            response.setId(newAppointment.getId());
            Doctor doctor = newAppointment.getDoctor();
            response.setDoctorName(doctor.getFullName());
            response.setNotes(newAppointment.getNotes());
            response.setStatus(newAppointment.getStatus().toString());
            response.setDate(newAppointment.getDoctorSlot().getDate().toString());
            response.setTime(newAppointment.getDoctorSlot().getStartTime().toString());
            response.setDoctorSlot(new DoctorSlotDTO(newAppointment.getDoctorSlot().getId(), newAppointment.getDoctorSlot().getDate(),
            newAppointment.getDoctorSlot().getStartTime(), newAppointment.getDoctorSlot().getEndTime(), newAppointment.getDoctorSlot().getDuration(), newAppointment.getDoctorSlot().getStatus().toString()));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long appointmentId) {
        appointmentService.cancelAppointment(appointmentId);
        return ResponseEntity.ok("Cancel appointment successfully");
    }
    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getUserAppointments(
            @AuthenticationPrincipal User user
    ) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByUser(user);
        return ResponseEntity.ok(appointments);
    }
}