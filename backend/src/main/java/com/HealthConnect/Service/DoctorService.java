package com.HealthConnect.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HealthConnect.Dto.AvailabilityDto;
import com.HealthConnect.Dto.DoctorAvailabilitiesResponse;
import com.HealthConnect.Dto.DoctorSlotDTO;
import com.HealthConnect.Exception.ResourceNotFoundException;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.DoctorAvailability;
import com.HealthConnect.Model.DoctorSlot;
import com.HealthConnect.Repository.DoctorAvailabilityRepository;
import com.HealthConnect.Repository.DoctorRepository;
import com.HealthConnect.Repository.DoctorSlotRepository;

@Service
public class DoctorService {
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    DoctorAvailabilityRepository doctorAvailabilityRepository;
    @Autowired
    DoctorSlotRepository doctorSlotRepository;
    @Autowired
    AppointmentService appointmentService;
    @Autowired
    UserService userService;
    @Autowired
    SlotService slotService;
    
    // public Doctor updateDoctor(Long id, String address, LocalDate dateOfBirth, String email, String fullName, String gender, String phone) {
    //     userService.updateBasicInfo(id, address, dateOfBirth, email, fullName, gender, phone);
    //     Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
    // }
    public Doctor getById(Long id) {
        return doctorRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
    }

    @Transactional
    public DoctorAvailabilitiesResponse updateDoctorAvailability(Doctor doctor, List<AvailabilityDto> availabilityDtos) {
        // Validate input
        if (availabilityDtos == null || availabilityDtos.isEmpty()) {
            throw new IllegalArgumentException("Availability list cannot be empty");
        }
        
        // Delete existing availabilities
        List<DoctorAvailability> existingAvailabilities = doctorAvailabilityRepository.findByDoctor(doctor);    
        if (!existingAvailabilities.isEmpty()) {
            doctorAvailabilityRepository.deleteAll(existingAvailabilities);
        }

        // Create new availabilities
        List<DoctorAvailability> newDoctorAvailabilities = availabilityDtos.stream()
            .map(dto -> createDoctorAvailability(dto, doctor))
            .collect(Collectors.toList());

        doctorAvailabilityRepository.saveAll(newDoctorAvailabilities);
        doctor.setAvailabilities(newDoctorAvailabilities);
        
        return DoctorAvailabilitiesResponse.builder()
                .doctorId(doctor.getId())
                .availabilities(availabilityDtos)
                .build();
    }
    
    private DoctorAvailability createDoctorAvailability(AvailabilityDto dto, Doctor doctor) {
        DoctorAvailability availability = new DoctorAvailability();
        availability.setDayOfWeek(dto.getDayOfWeek());
        availability.setStartTime(dto.getStartTime());
        availability.setEndTime(dto.getEndTime());
        availability.setDoctor(doctor);
        return availability;
    }

    public List<AvailabilityDto> getAvailability(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        
        return doctor.getAvailabilities().stream()
                .map(availability -> {
                    AvailabilityDto dto = new AvailabilityDto();
                    dto.setDayOfWeek(availability.getDayOfWeek());
                    dto.setStartTime(availability.getStartTime());
                    dto.setEndTime(availability.getEndTime());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    // Deprecated: Use SlotService.getAvailableSlots() instead
    @Deprecated
    public List<DoctorSlotDTO> getAvailableSlot(Long doctorId) {
        // Delegate to SlotService for backward compatibility
        return slotService.getAvailableSlots(doctorId);
    }
    public boolean isSlotAvailable(Long doctorId, LocalDate date, LocalTime startTime) {
        DoctorSlot slot = doctorSlotRepository.findByDoctorIdAndDateAndStartTime(doctorId, date, startTime);
        if (slot == null) {
            return true;
        }
        return slot.getStatus().equals(DoctorSlot.SlotStatus.AVAILABLE);
    }
    public DoctorSlot updateSlot(Long id, LocalDate date, LocalTime startTime, DoctorSlot.SlotStatus status) {
        DoctorSlot slot = doctorSlotRepository.findByDoctorIdAndDateAndStartTime(id, date, startTime);
        if (slot == null) {
            throw new RuntimeException("Slot not found");
        }
        System.out.println("slot.getId() = " + slot.getId());
        slot.setStatus(status);
        return doctorSlotRepository.save(slot);
    }
    public DoctorSlot getSlotById(Long id) {
        return doctorSlotRepository.findById(id).orElseGet(null);
    }
    public DoctorSlot getSlotByDoctorIdAndDateAndStartTime(Long doctorId, LocalDate date, LocalTime startTime) {
        return doctorSlotRepository.findByDoctorIdAndDateAndStartTime(doctorId, date, startTime);
    }
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
}
