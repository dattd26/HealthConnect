package com.HealthConnect.Controller;

import com.HealthConnect.Dto.AppointmentRequest;
import com.HealthConnect.Model.Appointment;
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
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByPatient(patientId);
        return ResponseEntity.ok(appointments);
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
            return ResponseEntity.ok(appointmentService.createAppointment(newAppointment));
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
    public ResponseEntity<List<Appointment>> getUserAppointments(
            @AuthenticationPrincipal User user
    ) {
        List<Appointment> appointments = appointmentService.getAppointmentsByUser(user);
        return ResponseEntity.ok(appointments);
    }
}