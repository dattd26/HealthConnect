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

import com.HealthConnect.Dto.AvailabilityDto;
import com.HealthConnect.Dto.DoctorSlotDTO;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
    
    @Autowired
    DoctorService doctorService;
    
    @GetMapping("/{id}/availability")
    public ResponseEntity<?> getAvailableTimeSlots(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getAvailability(id).getAvailabilities());
    }

    @GetMapping("/{id}/available-slots")
    public ResponseEntity<List<DoctorSlotDTO>> getAvailableSlotsTest(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getAvailableSlot(id));
    }
    
    @PostMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable Long id, @RequestBody List<AvailabilityDto> availability) {
        try {
            Doctor doctor = doctorService.getById(id);
            if (doctor == null) {
                return ResponseEntity.badRequest().body("Doctor not found");
            }
            return ResponseEntity.ok(doctorService.updateDoctorAvailability(doctor, availability));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
