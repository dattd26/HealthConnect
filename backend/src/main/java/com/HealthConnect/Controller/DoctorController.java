package com.HealthConnect.Controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;

import com.HealthConnect.Dto.AvailabilityDto;
import com.HealthConnect.Dto.DoctorSlotDTO;
import com.HealthConnect.Dto.DoctorResponse;
import com.HealthConnect.Dto.AppointmentWithPatientDto;
import com.HealthConnect.Exception.ResourceNotFoundException;
import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Service.DoctorService;
import com.HealthConnect.Service.SlotService;
import com.HealthConnect.Service.AppointmentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

    @RestController
    @RequestMapping("/api/doctors")
public class DoctorController {
    
    @Autowired
    private DoctorService doctorService;
    
    @Autowired
    private SlotService slotService;
    
    @Autowired
    private AppointmentService appointmentService;
    
    @GetMapping("/{id}/availability")
    public ResponseEntity<List<AvailabilityDto>> getAvailableTimeSlots(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id) {
        Doctor doctor = doctorService.getById(id);
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        return ResponseEntity.ok(doctorService.getAvailability(id));
    }

    @GetMapping("/{id}/available-slots")
    public ResponseEntity<List<DoctorSlotDTO>> getAvailableSlots(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id) {
        return ResponseEntity.ok(slotService.getAvailableSlots(id));
    }
    
    @GetMapping("/{id}/slots")
    public ResponseEntity<List<DoctorSlotDTO>> getSlotsByDateRange(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(slotService.getSlotsByDateRange(id, startDate, endDate));
    }
    
    @PostMapping("/{id}/availability")
    public ResponseEntity<Object> updateAvailability(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id, 
            @Valid @RequestBody List<AvailabilityDto> availability) {
        
        Doctor doctor = doctorService.getById(id);
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        // return ResponseEntity.ok("test hehe");
        Object result = null;
        try{
            result = doctorService.updateDoctorAvailability(doctor, availability);
        } catch (Exception e) {
            System.err.println("Error updating doctor availability: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Internal server error",
                "message", "Failed to update doctor availability: " + e.getMessage()
            ));
        }
        slotService.regenerateSlots(id);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/{id}/dashboard")
    public ResponseEntity<Map<String, Object>> getDoctorDashboard(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id) {
        try {
            Doctor doctor = doctorService.getById(id);
            if (doctor == null) {
                throw new ResourceNotFoundException("Doctor", "id", id);
            }
            
            Map<String, Object> dashboard = new HashMap<>();
            
            List<Appointment> todayAppointments = appointmentService.getTodayAppointmentsByDoctor(id);
            List<AppointmentWithPatientDto> todayAppointmentsDto = todayAppointments.stream()
                    .map(this::convertToAppointmentDto)
                    .filter(dto -> dto != null) 
                    .collect(Collectors.toList());
            
            dashboard.put("todayAppointments", todayAppointmentsDto);
            dashboard.put("todayAppointmentsCount", todayAppointmentsDto.size());
            
            List<Appointment> upcomingAppointments = appointmentService.getUpcomingAppointmentsByDoctor(id, 7);
            List<AppointmentWithPatientDto> upcomingAppointmentsDto = upcomingAppointments.stream()
                    .map(this::convertToAppointmentDto)
                    .filter(dto -> dto != null) 
                    .collect(Collectors.toList());
            
            dashboard.put("upcomingAppointments", upcomingAppointmentsDto);
            dashboard.put("upcomingAppointmentsCount", upcomingAppointmentsDto.size());
            
            List<DoctorSlotDTO> todaySlots = slotService.getSlotsByDate(id, LocalDate.now());
            long availableSlots = todaySlots.stream()
                    .filter(slot -> "AVAILABLE".equals(slot.getStatus()))
                    .count();
            dashboard.put("availableSlotsToday", availableSlots);
            
            dashboard.put("doctorInfo", doctor);
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            System.err.println("Error in getDoctorDashboard: " + e.getMessage());
            e.printStackTrace();
            throw e; 
        }
    }
    
    private AppointmentWithPatientDto convertToAppointmentDto(Appointment appointment) {
        if (appointment == null) {
            return null;
        }
        
        AppointmentWithPatientDto dto = new AppointmentWithPatientDto();
        dto.setId(appointment.getId());
        dto.setStatus(appointment.getStatus() != null ? appointment.getStatus().toString() : null);
        dto.setNotes(appointment.getNotes());
        dto.setZoomMeetingId(appointment.getZoomMeetingId());
        dto.setZoomJoinUrl(appointment.getZoomJoinUrl());
        dto.setZoomStartUrl(appointment.getZoomStartUrl());
        dto.setZoomPassword(appointment.getZoomPassword());
        
        if (appointment.getPatient() != null) {
            AppointmentWithPatientDto.PatientDto patientDto = new AppointmentWithPatientDto.PatientDto();
            patientDto.setId(appointment.getPatient().getId());
            patientDto.setFullName(appointment.getPatient().getFullName());
            patientDto.setEmail(appointment.getPatient().getEmail());
            patientDto.setPhone(appointment.getPatient().getPhone());
            patientDto.setGender(appointment.getPatient().getGender());
            patientDto.setDateOfBirth(appointment.getPatient().getDateOfBirth());
            dto.setPatient(patientDto);
        }
        
        if (appointment.getDoctorSlot() != null) {
            AppointmentWithPatientDto.DoctorSlotDto slotDto = new AppointmentWithPatientDto.DoctorSlotDto();
            slotDto.setId(appointment.getDoctorSlot().getId());
            slotDto.setDate(appointment.getDoctorSlot().getDate());
            slotDto.setStartTime(appointment.getDoctorSlot().getStartTime());
            slotDto.setEndTime(appointment.getDoctorSlot().getEndTime());
            slotDto.setDuration(appointment.getDoctorSlot().getDuration());
            slotDto.setStatus(appointment.getDoctorSlot().getStatus() != null ? 
                appointment.getDoctorSlot().getStatus().toString() : null);
            dto.setDoctorSlot(slotDto);
        }
        
        return dto;
    }

    @GetMapping("/{id}/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDoctorDashboardStats(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id,
            @RequestParam(defaultValue = "30") int days) {
        
        Doctor doctor = doctorService.getById(id);
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        
        Map<String, Object> stats = doctorService.getDashboardStatistics(id, days);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}/appointments")
    public ResponseEntity<Map<String, Object>> getDoctorAppointments(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Doctor doctor = doctorService.getById(id);
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        
        Map<String, Object> response = new HashMap<>();
        List<Appointment> appointments;
        int totalCount = 0;
        
        if (date != null) {
            appointments = appointmentService.getAppointmentsByDoctorAndDate(id, date);
            totalCount = appointments.size();
        } else if (startDate != null && endDate != null) {
            appointments = appointmentService.getAppointmentsByDoctorAndDateRange(id, startDate, endDate);
            totalCount = appointments.size();
        } else if (status != null) {
            appointments = appointmentService.getAppointmentsByDoctorAndStatus(id, status);
            totalCount = appointments.size();
        } else {
            appointments = appointmentService.getAppointmentsByDoctor(id);
            totalCount = appointments.size();
        }
        
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, appointments.size());
        List<Appointment> paginatedAppointments = appointments.subList(startIndex, endIndex);
        
        response.put("appointments", paginatedAppointments);
        response.put("totalCount", totalCount);
        response.put("currentPage", page);
        response.put("pageSize", size);
        response.put("totalPages", (int) Math.ceil((double) totalCount / size));
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/appointments/calendar")
    public ResponseEntity<Map<String, Object>> getAppointmentCalendar(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate month,
            @RequestParam(defaultValue = "false") boolean includeSlots) {
        
        Doctor doctor = doctorService.getById(id);
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        
        Map<String, Object> calendar = doctorService.getAppointmentCalendar(id, month, includeSlots);
        return ResponseEntity.ok(calendar);
    }

    @PutMapping("/{id}/appointments/{appointmentId}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id,
            @PathVariable @Positive(message = "Appointment ID must be positive") Long appointmentId,
            @RequestBody Map<String, String> statusUpdate) {
        
        Doctor doctor = doctorService.getById(id);
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        
        String newStatus = statusUpdate.get("status");
        if (newStatus == null) {
            throw new IllegalArgumentException("Status is required");
        }
        
        Appointment updatedAppointment = appointmentService.updateAppointmentStatus(appointmentId, newStatus);
        return ResponseEntity.ok(updatedAppointment);
    }

    @GetMapping("/{id}/appointments/{appointmentId}/patient-records")
    public ResponseEntity<Map<String, Object>> getPatientHealthRecords(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id,
            @PathVariable @Positive(message = "Appointment ID must be positive") Long appointmentId) {
        
        Doctor doctor = doctorService.getById(id);
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        
        Map<String, Object> patientRecords = doctorService.getPatientHealthRecordsForAppointment(id, appointmentId);
        return ResponseEntity.ok(patientRecords);
    }

    @GetMapping("/{id}/schedule")
    public ResponseEntity<Map<String, Object>> getDoctorSchedule(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        Doctor doctor = doctorService.getById(id);
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        
        Map<String, Object> schedule = doctorService.getDoctorSchedule(id, date);
        return ResponseEntity.ok(schedule);
    }


    @GetMapping("/{id}/schedule/weekly")
    public ResponseEntity<Map<String, Object>> getWeeklySchedule(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        
        Doctor doctor = doctorService.getById(id);
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        
        Map<String, Object> weeklySchedule = doctorService.getWeeklySchedule(id, weekStart);
        return ResponseEntity.ok(weeklySchedule);
    }
    
    @GetMapping("/{id}/profile")
    public ResponseEntity<DoctorResponse> getDoctorProfile(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id) {
        Doctor doctor = doctorService.getById(id);
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        
        DoctorResponse response = new DoctorResponse();
        response.setId(doctor.getId());
        response.setFullName(doctor.getFullName());
        response.setEmail(doctor.getEmail());
        response.setPhone(doctor.getPhone());
        response.setLicense(doctor.getLicense());
        response.setHospital(doctor.getHospital());
        response.setSpecialties(doctor.getSpecialties());
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/profile")
    public ResponseEntity<DoctorResponse> updateDoctorProfile(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long id,
            @Valid @RequestBody DoctorResponse doctorRequest) {
        
        Doctor doctor = doctorService.getById(id);
        if (doctor == null) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        
        
        doctor.setFullName(doctorRequest.getFullName());
        doctor.setEmail(doctorRequest.getEmail());
        doctor.setPhone(doctorRequest.getPhone());
        doctor.setHospital(doctorRequest.getHospital());
        
        Doctor updatedDoctor = doctorService.updateDoctor(doctor);
        
        DoctorResponse response = new DoctorResponse();
        response.setId(updatedDoctor.getId());
        response.setFullName(updatedDoctor.getFullName());
        response.setEmail(updatedDoctor.getEmail());
        response.setPhone(updatedDoctor.getPhone());
        response.setLicense(updatedDoctor.getLicense());
        response.setHospital(updatedDoctor.getHospital());
        response.setSpecialties(updatedDoctor.getSpecialties());
        
        return ResponseEntity.ok(response);
    }
}
