package com.HealthConnect.Controller;

import com.HealthConnect.Dto.AppointmentRequest;
import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.User;
import com.HealthConnect.Service.AppointmentService;
import com.HealthConnect.Service.UserService;
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
    private UserService userService;

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
    public ResponseEntity<Appointment> createAppointment(@AuthenticationPrincipal UserDetails userDetails, @RequestBody AppointmentRequest request) {


        Appointment newAppointment = new Appointment();
        // newAppointment.setAppointmentTime(request.getAppointmentTime());
        newAppointment.setDoctor(userService.getUserById(request.getDoctorId()));
        newAppointment.setPatient(userService.getUserByUsername(userDetails.getUsername()));
        newAppointment.setStatus("SCHEDULED");
        newAppointment.setNotes(request.getNotes());

        return ResponseEntity.ok(appointmentService.createAppointment(newAppointment));
    }

    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long appointmentId) {
        appointmentService.cancelAppointment(appointmentId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping
    public ResponseEntity<List<Appointment>> getUserAppointments(
            @AuthenticationPrincipal User user
    ) {
        List<Appointment> appointments = appointmentService.getAppointmentsByUser(user);
        return ResponseEntity.ok(appointments);
    }
}