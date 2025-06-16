package com.HealthConnect.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HealthConnect.Dto.AppointmentSlotDTO;
import com.HealthConnect.Dto.AvailabilityDto;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Service.ApointmentSlotService;
import com.HealthConnect.Service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
    
    @Autowired
    DoctorService doctorService;
    @Autowired
    ApointmentSlotService apointmentSlotService;
    
    @GetMapping("/{id}/availability")
    public ResponseEntity<?> getAvailableTimeSlots(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getAvailableTimeslots(id).getAvailabilities());
    }

    @GetMapping("/{id}/available-slots")
    public ResponseEntity<?> getAvailableSlots(@PathVariable Long id) {
        return ResponseEntity.ok(apointmentSlotService.getAvailableSlotsForDoctor(id));
    }
    @PostMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable Long id, @RequestBody List<AvailabilityDto> availability) {
        try {
            Doctor doctor = doctorService.getDoctor(id);
            if (doctor == null) {
                return ResponseEntity.badRequest().body("Doctor not found");
            }
            return ResponseEntity.ok(doctorService.updateDoctorAvailability(doctor, availability));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/{id}/book-slot")
    public ResponseEntity<?> bookSlot(@PathVariable Long id, @RequestBody AppointmentSlotDTO appointmentSlotDTO) {
        return ResponseEntity.ok(apointmentSlotService.bookSlot(id, appointmentSlotDTO.getDate(), appointmentSlotDTO.getStartTime()));
    }
}
