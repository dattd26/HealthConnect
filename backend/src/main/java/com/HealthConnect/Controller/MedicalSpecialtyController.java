package com.HealthConnect.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.HealthConnect.Dto.SpecialtyRequest;
import com.HealthConnect.Model.MedicalSpecialty;
import com.HealthConnect.Service.MedicalSpecialtyService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/specialties")
public class MedicalSpecialtyController {
    @Autowired
    MedicalSpecialtyService specialtyService;

    @PostMapping()
    public ResponseEntity<?> create(@RequestBody SpecialtyRequest request) {
        if (request.getName() == null) {
            return ResponseEntity.badRequest().body("Name is required");
        }
        if (request.getDescription() == null) {
            return ResponseEntity.badRequest().body("Description is required");
        }
        if (request.getCode() == null || specialtyService.findByCode(request.getCode()) != null) {
            return ResponseEntity.badRequest().body("Code is required or already exists");
        }
        MedicalSpecialty specialty = new MedicalSpecialty();
        specialty.setCode(request.getCode());
        specialty.setName(request.getName());
        specialty.setDescription(request.getDescription());
        specialty = specialtyService.saveSpecialty(specialty);
        return ResponseEntity.ok(specialty);
    }
    @GetMapping()
    public ResponseEntity<?> getAllSpecialties() {
        return ResponseEntity.ok(specialtyService.getAllSpecialties());
    }

    // @PutMapping("/{code}")
    // public ResponseEntity<?> addDoctorToSpecialty(@RequestBody DoctorRequest request, @PathVariable String code) {
    //     MedicalSpecialty specialty = specialtyService.findByCode(code);
    //     if (specialty == null) {
    //         return ResponseEntity.badRequest().body("Specialty not found");
    //     }
        
    //     specialty = specialtyService.saveSpecialty(specialty);
    //     return ResponseEntity.ok(specialty);
    // }
}
