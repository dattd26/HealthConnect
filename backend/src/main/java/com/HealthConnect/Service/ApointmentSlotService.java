package com.HealthConnect.Service;

import com.HealthConnect.Dto.AppointmentSlotDTO;
import com.HealthConnect.Model.AppointmentSlot;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.DoctorAvailability;
import com.HealthConnect.Repository.DoctorAvailabilityRepository;
import com.HealthConnect.Repository.DoctorRepository;
import com.HealthConnect.Repository.AppointmentSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApointmentSlotService {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentSlotRepository appointmentSlotRepository;
    
    private static final Duration DEFAULT_SLOT_DURATION = Duration.ofMinutes(30);
    private static final int DAYS_TO_GENERATE = 7; // Generate slots for next 2 weeks
    
    private void createSlotsForAvailability(
            DoctorAvailability availability,
            LocalDate currentDate,
            Long doctorId,
            List<AppointmentSlot> existingSlots,
            List<AppointmentSlotDTO> availableSlots) {
            
        LocalTime currentTime = availability.getStartTime();
        LocalTime endTime = availability.getEndTime();
        
        while (currentTime.plus(DEFAULT_SLOT_DURATION).isBefore(endTime) || 
               currentTime.plus(DEFAULT_SLOT_DURATION).equals(endTime)) {
            
            final LocalTime slotTime = currentTime;
            
            if (currentDate.isEqual(LocalDate.now()) && (slotTime.isBefore(LocalTime.now()) || slotTime.equals(LocalTime.now()))) {
                currentTime = currentTime.plus(DEFAULT_SLOT_DURATION);
                continue;
            }

            // Check if this slot is already booked
            boolean isBooked = existingSlots.stream()
                .anyMatch(slot -> 
                    slot.getDate().equals(currentDate) &&
                    slot.getStartTime().equals(slotTime) &&
                    slot.getStatus() == AppointmentSlot.SlotStatus.BOOKED
                );
            
            AppointmentSlotDTO slotDTO = new AppointmentSlotDTO();
            slotDTO.setDoctorId(doctorId);
            slotDTO.setDate(currentDate);
            slotDTO.setStartTime(slotTime);
            slotDTO.setEndTime(slotTime.plus(DEFAULT_SLOT_DURATION));
            slotDTO.setDuration(DEFAULT_SLOT_DURATION);
            slotDTO.setStatus(AppointmentSlot.SlotStatus.AVAILABLE.name());
            if (isBooked) {
                slotDTO.setStatus(AppointmentSlot.SlotStatus.BOOKED.name());
            }
            
            availableSlots.add(slotDTO);
            
            currentTime = currentTime.plus(DEFAULT_SLOT_DURATION);
        }
    }

    @Transactional(readOnly = true)
    public List<AppointmentSlotDTO> getAvailableSlotsForDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
        List<DoctorAvailability> availabilities = availabilityRepository.findByDoctorId(doctorId);
        if (availabilities.isEmpty()) {
            throw new RuntimeException("No availability set for this doctor");
        }

        List<AppointmentSlotDTO> availableSlots = new ArrayList<>();
        LocalDate startDate = LocalDate.now();
        
        List<AppointmentSlot> existingSlots = appointmentSlotRepository
            .findByDoctorIdAndDateBetween(doctorId, startDate, startDate.plusDays(DAYS_TO_GENERATE));
        
        for (int i = 0; i < DAYS_TO_GENERATE; i++) {
            LocalDate currentDate = startDate.plusDays(i);
            DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
            
            for (DoctorAvailability availability : availabilities) {
                if (availability.getDayOfWeek().equals(dayOfWeek)) {
                    createSlotsForAvailability(availability, currentDate, doctorId, existingSlots, availableSlots);
                }
            }
        }
        
        return availableSlots;
    }
    
    @Transactional
    public AppointmentSlot bookSlot(Long doctorId, LocalDate date, LocalTime startTime) {
        // Check if slot is available
        List<AppointmentSlot> existingSlots = appointmentSlotRepository
            .findByDoctorIdAndDateAndStartTime(doctorId, date, startTime);
            
        if (!existingSlots.isEmpty()) {
            throw new RuntimeException("Slot is already booked");
        }
        
        // Create new slot
        AppointmentSlot slot = new AppointmentSlot();
        slot.setDoctor(doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found")));
        slot.setDate(date);
        slot.setStartTime(startTime);
        slot.setEndTime(startTime.plus(DEFAULT_SLOT_DURATION));
        slot.setDuration(DEFAULT_SLOT_DURATION);
        slot.setStatus(AppointmentSlot.SlotStatus.BOOKED);
        
        return appointmentSlotRepository.save(slot);
    }
    
    @Transactional(readOnly = true)
    public List<AppointmentSlotDTO> getAvailableSlotsForDoctorAndDate(Long doctorId, LocalDate date) {
        return getAvailableSlotsForDoctor(doctorId).stream()
            .filter(slot -> slot.getDate().equals(date))
            .collect(Collectors.toList());
    }
} 