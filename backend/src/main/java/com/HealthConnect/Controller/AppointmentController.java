package com.HealthConnect.Controller;

import com.HealthConnect.Dto.AppointmentRequest;
import com.HealthConnect.Dto.AppointmentResponse;
import com.HealthConnect.Dto.DoctorResponse;
import com.HealthConnect.Dto.DoctorSlotDTO;
import com.HealthConnect.Dto.Zoom.CreateMeetingRequest;
import com.HealthConnect.Dto.Zoom.ZoomMeetingResponse;
import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.DoctorSlot;
import com.HealthConnect.Model.User;
import com.HealthConnect.Service.AppointmentService;
import com.HealthConnect.Service.DoctorService;
import com.HealthConnect.Service.PatientService;
import com.HealthConnect.Service.ZoomService;
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
    
    @Autowired
    private ZoomService zoomService;
    
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
                response.setZoomJoinUrl(appointment.getZoomJoinUrl());
                response.setZoomStartUrl(appointment.getZoomStartUrl());
                response.setZoomMeetingId(appointment.getZoomMeetingId());
                response.setZoomPassword(appointment.getZoomPassword());
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
            Doctor doctor = doctorService.getById(request.getDoctorId());
            DoctorSlot slot = doctorService.getSlotByDoctorIdAndDateAndStartTime(request.getDoctorId(), request.getDate(), request.getStartTime());
            if (slot == null || slot.getStatus() != DoctorSlot.SlotStatus.AVAILABLE) {
                throw new RuntimeException(slot == null ? "Slot not found" : "Slot is not available");
            }
            CreateMeetingRequest meetingRequest = new CreateMeetingRequest();
            meetingRequest.setTopic("Appointment with " + doctor.getFullName());
            meetingRequest.setAgenda(request.getNotes());
            meetingRequest.setDuration((int) slot.getDuration().toMinutes());
            meetingRequest.setStartTime(slot.getDate().toString() + "T" + slot.getStartTime().toString() + ":00Z");
            meetingRequest.setTimezone("Asia/Ho_Chi_Minh");
            meetingRequest.setDoctorEmail(doctor.getEmail());
            ZoomMeetingResponse zoomMeeting = zoomService.createMeeting(meetingRequest);

            slot.setStatus(DoctorSlot.SlotStatus.BOOKED);
            Appointment newAppointment = new Appointment();
            newAppointment.setDoctor(doctor);
            newAppointment.setDoctorSlot(slot);
            newAppointment.setPatient(patientService.getByUsername(userDetails.getUsername()));
            newAppointment.setStatus(Appointment.AppointmentStatus.WAITING);
            newAppointment.setNotes(request.getNotes());
            newAppointment.setZoomJoinUrl(zoomMeeting.getJoinUrl());
            newAppointment.setZoomStartUrl(zoomMeeting.getStartUrl());
            newAppointment.setZoomMeetingId(String.valueOf(zoomMeeting.getId()));
            newAppointment.setZoomPassword(zoomMeeting.getPassword());
            appointmentService.createAppointment(newAppointment);

            AppointmentResponse response = new AppointmentResponse();
            response.setId(newAppointment.getId());
            response.setDoctorName(doctor.getFullName());
            response.setNotes(newAppointment.getNotes());
            response.setStatus(newAppointment.getStatus().toString());
            response.setDate(slot.getDate().toString());
            response.setTime(slot.getStartTime().toString());
            response.setDoctorSlot(new DoctorSlotDTO(slot.getId(), slot.getDate(), slot.getStartTime(), slot.getEndTime(), slot.getDuration(), slot.getStatus().toString()));
            response.setZoomJoinUrl(zoomMeeting.getJoinUrl());
            response.setZoomStartUrl(zoomMeeting.getStartUrl());
            response.setZoomMeetingId(String.valueOf(zoomMeeting.getId()));
            response.setZoomPassword(zoomMeeting.getPassword());
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

    @GetMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable Long appointmentId) {
        Appointment appointment = appointmentService.getAppointmentById(appointmentId);
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        response.setDoctorName(appointment.getDoctor().getFullName());
        response.setNotes(appointment.getNotes());
        response.setStatus(appointment.getStatus().toString());
        response.setDate(appointment.getDoctorSlot().getDate().toString());
        response.setTime(appointment.getDoctorSlot().getStartTime().toString());
        response.setDoctorSlot(new DoctorSlotDTO(
                appointment.getDoctorSlot().getId(),
                appointment.getDoctorSlot().getDate(),
                appointment.getDoctorSlot().getStartTime(),
                appointment.getDoctorSlot().getEndTime(),
                appointment.getDoctorSlot().getDuration(),
                appointment.getDoctorSlot().getStatus().toString()
        ));
        response.setZoomJoinUrl(appointment.getZoomJoinUrl());
        response.setZoomStartUrl(appointment.getZoomStartUrl());
        response.setZoomMeetingId(appointment.getZoomMeetingId());
        response.setZoomPassword(appointment.getZoomPassword());
        return ResponseEntity.ok(response);
    }
}