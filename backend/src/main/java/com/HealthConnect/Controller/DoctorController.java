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

import com.HealthConnect.Dto.DoctorTimeSlotDTO;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.DoctorTimeslot;
import com.HealthConnect.Service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
    
    @Autowired
    DoctorService doctorService;

    @GetMapping("/{id}/available-slots")
    public ResponseEntity<?> getAvailableTimeSlots(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getAvailableTimeslots(id).getTimeslots());
    }

    @PostMapping("/{id}/available-slots")
    public ResponseEntity<?> createDoctorTimeSlots(@PathVariable Long id, @RequestBody List<DoctorTimeSlotDTO> timeSlots) {
        Doctor doctor = doctorService.getDoctor(id);
        if (doctor == null) {
            return ResponseEntity.badRequest().body("Doctor not found");
        }
        return ResponseEntity.ok(doctorService.updateTimeSlots(doctor, timeSlots));
    }
}
