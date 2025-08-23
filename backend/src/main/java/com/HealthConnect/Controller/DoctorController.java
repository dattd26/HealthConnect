package com.HealthConnect.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;

import com.HealthConnect.Dto.AvailabilityDto;
import com.HealthConnect.Dto.DoctorSlotDTO;
import com.HealthConnect.Exception.ResourceNotFoundException;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Service.DoctorService;
import com.HealthConnect.Service.SlotService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.format.annotation.DateTimeFormat;

    @RestController
    @RequestMapping("/api/doctors")
public class DoctorController {
    
    @Autowired
    private DoctorService doctorService;
    
    @Autowired
    private SlotService slotService;
    
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
        
        Object result = doctorService.updateDoctorAvailability(doctor, availability);
        // Regenerate slots after availability update
        slotService.regenerateSlots(id);
        return ResponseEntity.ok(result);
    }
}
