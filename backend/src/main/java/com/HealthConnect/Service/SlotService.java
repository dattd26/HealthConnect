package com.HealthConnect.Service;

import com.HealthConnect.Dto.DoctorSlotDTO;
import com.HealthConnect.Exception.BusinessException;
import com.HealthConnect.Exception.ResourceNotFoundException;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.DoctorAvailability;
import com.HealthConnect.Model.DoctorSlot;
import com.HealthConnect.Repository.DoctorRepository;
import com.HealthConnect.Repository.DoctorSlotRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SlotService {
    
    private static final Duration DEFAULT_SLOT_DURATION = Duration.ofMinutes(30);
    private static final int DAYS_TO_GENERATE = 14; // Generate slots for 2 weeks
    private static final int BATCH_SIZE = 100; // Batch size for database operations
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private DoctorSlotRepository doctorSlotRepository;
    

    @Cacheable(value = "doctorSlots", key = "#doctorId + '_' + T(java.time.LocalDate).now()")
    public List<DoctorSlotDTO> getAvailableSlots(Long doctorId) {
        Doctor doctor = getDoctorById(doctorId);
        
        List<DoctorAvailability> availabilities = doctor.getAvailabilities();
        if (availabilities.isEmpty()) {
            return new ArrayList<>();
        }
        
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(DAYS_TO_GENERATE);
        
        
        List<DoctorSlot> existingSlots = doctorSlotRepository
                .findByDoctorIdAndDateBetween(doctorId, startDate, endDate);
        
        Map<String, DoctorSlot> existingSlotMap = existingSlots.stream()
                .collect(Collectors.toMap(this::createSlotKey, slot -> slot));
        
        
        List<DoctorSlotDTO> allSlots = generateSlotsForDateRange(
                doctor, availabilities, startDate, endDate, existingSlotMap);

        createMissingSlots(doctor, allSlots, existingSlotMap);
        
        return allSlots.stream()
                .filter(slot -> slot.getDate().isAfter(LocalDate.now()) || 
                              (slot.getDate().equals(LocalDate.now()) && 
                               slot.getStartTime().isAfter(LocalTime.now())))
                .sorted(this::compareSlots)
                .collect(Collectors.toList());
    }
    

    public List<DoctorSlotDTO> getSlotsByDateRange(Long doctorId, LocalDate startDate, LocalDate endDate) {
        Doctor doctor = getDoctorById(doctorId);
        
        List<DoctorSlot> slots = doctorSlotRepository
                .findByDoctorIdAndDateBetween(doctorId, startDate, endDate);
        
        return slots.stream()
                .map(this::convertToDTO)
                .sorted(this::compareSlots)
                .collect(Collectors.toList());
    }
    

    @Transactional
    @CacheEvict(value = "doctorSlots", key = "#doctorId + '_' + T(java.time.LocalDate).now()")
    public DoctorSlot bookSlot(Long doctorId, LocalDate date, LocalTime startTime) {
        DoctorSlot slot = doctorSlotRepository
                .findByDoctorIdAndDateAndStartTime(doctorId, date, startTime);
        
        if (slot == null) {
            throw new ResourceNotFoundException("Slot not found for the specified date and time");
        }
        
        if (slot.getStatus() != DoctorSlot.SlotStatus.AVAILABLE) {
            throw new BusinessException("The selected time slot is no longer available");
        }
        
        // Use optimistic locking to prevent race conditions
        slot.setStatus(DoctorSlot.SlotStatus.BOOKED);
        return doctorSlotRepository.save(slot);
    }
    

    @Transactional
    @CacheEvict(value = "doctorSlots", key = "#doctorId + '_' + T(java.time.LocalDate).now()")
    public DoctorSlot releaseSlot(Long doctorId, LocalDate date, LocalTime startTime) {
        DoctorSlot slot = doctorSlotRepository
                .findByDoctorIdAndDateAndStartTime(doctorId, date, startTime);
        
        if (slot == null) {
            throw new ResourceNotFoundException("Slot not found");
        }
        
        slot.setStatus(DoctorSlot.SlotStatus.AVAILABLE);
        return doctorSlotRepository.save(slot);
    }
    

    @CacheEvict(value = "doctorSlots", key = "#doctorId + '_' + T(java.time.LocalDate).now()")
    public void regenerateSlots(Long doctorId) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(DAYS_TO_GENERATE);
        
        doctorSlotRepository.deleteByDoctorIdAndDateBetweenAndStatus(
                doctorId, startDate, endDate, DoctorSlot.SlotStatus.AVAILABLE);
       
        getAvailableSlots(doctorId);
    }

  
    @Transactional
    public void cleanupDuplicateSlots(Long doctorId) {
        log.info("Cleaning up duplicate slots for doctor: {}", doctorId);
        
        List<DoctorSlot> allSlots = doctorSlotRepository.findByDoctorId(doctorId);
        Map<String, List<DoctorSlot>> slotGroups = allSlots.stream()
                .collect(Collectors.groupingBy(this::createSlotKey));
        
        int duplicatesRemoved = 0;
        for (Map.Entry<String, List<DoctorSlot>> entry : slotGroups.entrySet()) {
            List<DoctorSlot> slots = entry.getValue();
            if (slots.size() > 1) {
                // Keep the first slot, remove the rest
                for (int i = 1; i < slots.size(); i++) {
                    DoctorSlot duplicateSlot = slots.get(i);
                    if (duplicateSlot.getStatus() == DoctorSlot.SlotStatus.AVAILABLE) {
                        doctorSlotRepository.delete(duplicateSlot);
                        duplicatesRemoved++;
                    }
                }
            }
        }
        
        log.info("Removed {} duplicate slots for doctor: {}", duplicatesRemoved, doctorId);
    }
    
    private Doctor getDoctorById(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));
    }
    
    private List<DoctorSlotDTO> generateSlotsForDateRange(Doctor doctor, 
                                                         List<DoctorAvailability> availabilities,
                                                         LocalDate startDate, LocalDate endDate,
                                                         Map<String, DoctorSlot> existingSlotMap) {
        List<DoctorSlotDTO> allSlots = new ArrayList<>();
        LocalTime currentTime = LocalTime.now();
        
        for (LocalDate currentDate = startDate; !currentDate.isAfter(endDate); currentDate = currentDate.plusDays(1)) {
            DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
            final LocalDate finalDate = currentDate; // Make it effectively final
            
            // Find availability for this day
            availabilities.stream()
                    .filter(availability -> availability.getDayOfWeek().equals(dayOfWeek))
                    .forEach(availability -> {
                        List<DoctorSlotDTO> daySlots = generateSlotsForDay(
                                doctor, finalDate, availability, existingSlotMap, currentTime);
                        allSlots.addAll(daySlots);
                    });
        }
        
        return allSlots;
    }
    
    private List<DoctorSlotDTO> generateSlotsForDay(Doctor doctor, LocalDate date,
                                                   DoctorAvailability availability,
                                                   Map<String, DoctorSlot> existingSlotMap,
                                                   LocalTime currentTime) {
        List<DoctorSlotDTO> daySlots = new ArrayList<>();
        LocalTime slotTime = availability.getStartTime();
        LocalTime endTime = availability.getEndTime();
        
        while (slotTime.isBefore(endTime)) {
       
            if (date.equals(LocalDate.now()) && !slotTime.isAfter(currentTime)) {
                slotTime = slotTime.plus(DEFAULT_SLOT_DURATION);
                continue;
            }
            
            String slotKey = createSlotKey(date, slotTime);
            DoctorSlot existingSlot = existingSlotMap.get(slotKey);
            
            DoctorSlot.SlotStatus status = existingSlot != null ? 
                    existingSlot.getStatus() : DoctorSlot.SlotStatus.AVAILABLE;
            
            DoctorSlotDTO slotDTO = createSlotDTO(doctor.getId(), date, slotTime, status);
            daySlots.add(slotDTO);
            
            slotTime = slotTime.plus(DEFAULT_SLOT_DURATION);
        }
        
        return daySlots;
    }
    
    @Transactional
    private void createMissingSlots(Doctor doctor, List<DoctorSlotDTO> allSlots, 
                                  Map<String, DoctorSlot> existingSlotMap) {
        List<DoctorSlot> newSlots = new ArrayList<>();
        
        for (DoctorSlotDTO slotDTO : allSlots) {
            String slotKey = createSlotKey(slotDTO.getDate(), slotDTO.getStartTime());
            if (!existingSlotMap.containsKey(slotKey)) {
                DoctorSlot newSlot = createSlotEntity(doctor, slotDTO);
                newSlots.add(newSlot);

                if (newSlots.size() >= BATCH_SIZE) {
                    try {
                        doctorSlotRepository.saveAll(newSlots);
                        newSlots.clear();
                    } catch (Exception e) {
                        if (e.getMessage().contains("Duplicate key") || e.getMessage().contains("uk_doctor_slot_unique")) {
       
                            log.warn("Duplicate slots detected for doctor {} on date {}, skipping...", 
                                    doctor.getId(), slotDTO.getDate());
                            newSlots.clear();
                        } else {
                            throw e; 
                        }
                    }
                }
            }
        }
   
        if (!newSlots.isEmpty()) {
            try {
                doctorSlotRepository.saveAll(newSlots);
            } catch (Exception e) {
                if (e.getMessage().contains("Duplicate key") || e.getMessage().contains("uk_doctor_slot_unique")) {
                    log.warn("Duplicate slots detected for doctor {} on remaining slots, skipping...", doctor.getId());
                } else {
                    throw e;
                }
            }
        }
    }
    
    private String createSlotKey(LocalDate date, LocalTime startTime) {
        return date.toString() + "_" + startTime.toString();
    }
    
    private String createSlotKey(DoctorSlot slot) {
        return createSlotKey(slot.getDate(), slot.getStartTime());
    }
    
    private DoctorSlotDTO createSlotDTO(Long doctorId, LocalDate date, LocalTime startTime, 
                                       DoctorSlot.SlotStatus status) {
        DoctorSlotDTO dto = new DoctorSlotDTO();
        dto.setDoctorId(doctorId);
        dto.setDate(date);
        dto.setStartTime(startTime);
        dto.setEndTime(startTime.plus(DEFAULT_SLOT_DURATION));
        dto.setDuration(DEFAULT_SLOT_DURATION);
        dto.setStatus(status.toString());
        return dto;
    }
    
    private DoctorSlot createSlotEntity(Doctor doctor, DoctorSlotDTO slotDTO) {
        DoctorSlot slot = new DoctorSlot();
        slot.setDoctor(doctor);
        slot.setDate(slotDTO.getDate());
        slot.setStartTime(slotDTO.getStartTime());
        slot.setEndTime(slotDTO.getEndTime());
        slot.setDuration(slotDTO.getDuration());
        slot.setStatus(DoctorSlot.SlotStatus.valueOf(slotDTO.getStatus()));
        return slot;
    }
    
    private DoctorSlotDTO convertToDTO(DoctorSlot slot) {
        return createSlotDTO(slot.getDoctor().getId(), slot.getDate(), 
                           slot.getStartTime(), slot.getStatus());
    }
    
    private int compareSlots(DoctorSlotDTO a, DoctorSlotDTO b) {
        int dateCompare = a.getDate().compareTo(b.getDate());
        return dateCompare != 0 ? dateCompare : a.getStartTime().compareTo(b.getStartTime());
    }
    
    // New method for getting slots by specific date
    public List<DoctorSlotDTO> getSlotsByDate(Long doctorId, LocalDate date) {
        List<DoctorSlot> slots = doctorSlotRepository.findByDoctorIdAndDate(doctorId, date);
        return slots.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
