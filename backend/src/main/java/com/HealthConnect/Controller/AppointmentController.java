package com.HealthConnect.Controller;

import com.HealthConnect.Dto.AppointmentRequest;
import com.HealthConnect.Dto.AppointmentResponse;

import com.HealthConnect.Dto.DoctorSlotDTO;
import com.HealthConnect.Dto.Zoom.CreateMeetingRequest;
import com.HealthConnect.Dto.Zoom.ZoomMeetingResponse;
import com.HealthConnect.Exception.BusinessException;
import com.HealthConnect.Exception.ResourceNotFoundException;
import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.DoctorSlot;
import com.HealthConnect.Model.User;
import com.HealthConnect.Service.AppointmentService;
import com.HealthConnect.Service.DoctorService;
import com.HealthConnect.Service.PatientService;
import com.HealthConnect.Service.SlotService;
import com.HealthConnect.Service.ZoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    private SlotService slotService;
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
    public ResponseEntity<AppointmentResponse> createAppointment(
            @AuthenticationPrincipal UserDetails userDetails, 
            @Valid @RequestBody AppointmentRequest request) {
        
        Doctor doctor = doctorService.getById(request.getDoctorId());
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor", "id", request.getDoctorId());
        }
        
        // Use SlotService for atomic booking with optimistic locking
        DoctorSlot slot = slotService.bookSlot(
                request.getDoctorId(), request.getDate(), request.getStartTime());
        
        // Create Zoom meeting
        CreateMeetingRequest meetingRequest = buildMeetingRequest(doctor, request, slot);
        ZoomMeetingResponse zoomMeeting = zoomService.createMeeting(meetingRequest);
        
        // Create appointment
        Appointment newAppointment = buildAppointment(userDetails, request, doctor, slot, zoomMeeting);
        
        // Save appointment (slot is already booked by SlotService)
        appointmentService.createAppointment(newAppointment);
        
        // Build response
        AppointmentResponse response = buildAppointmentResponse(newAppointment, zoomMeeting);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    private CreateMeetingRequest buildMeetingRequest(Doctor doctor, AppointmentRequest request, DoctorSlot slot) {
        CreateMeetingRequest meetingRequest = new CreateMeetingRequest();
        meetingRequest.setTopic("Appointment with " + doctor.getFullName());
        meetingRequest.setAgenda(request.getNotes());
        meetingRequest.setDuration((int) slot.getDuration().toMinutes());
        meetingRequest.setStartTime(slot.getDate().toString() + "T" + slot.getStartTime().toString() + ":00Z");
        meetingRequest.setTimezone("Asia/Ho_Chi_Minh");
        meetingRequest.setDoctorEmail(doctor.getEmail());
        return meetingRequest;
    }
    
    private Appointment buildAppointment(UserDetails userDetails, AppointmentRequest request, 
                                       Doctor doctor, DoctorSlot slot, ZoomMeetingResponse zoomMeeting) {
        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setDoctorSlot(slot);
        appointment.setPatient(patientService.getByUsername(userDetails.getUsername()));
        appointment.setStatus(Appointment.AppointmentStatus.WAITING);
        appointment.setNotes(request.getNotes());
        appointment.setZoomJoinUrl(zoomMeeting.getJoinUrl());
        appointment.setZoomStartUrl(zoomMeeting.getStartUrl());
        appointment.setZoomMeetingId(String.valueOf(zoomMeeting.getId()));
        appointment.setZoomPassword(zoomMeeting.getPassword());
        return appointment;
    }
    
    private AppointmentResponse buildAppointmentResponse(Appointment appointment, ZoomMeetingResponse zoomMeeting) {
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
        response.setZoomJoinUrl(zoomMeeting.getJoinUrl());
        response.setZoomStartUrl(zoomMeeting.getStartUrl());
        response.setZoomMeetingId(String.valueOf(zoomMeeting.getId()));
        response.setZoomPassword(zoomMeeting.getPassword());
        return response;
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