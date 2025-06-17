package com.HealthConnect.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthConnect.Dto.AvailabilityDto;
import com.HealthConnect.Dto.DoctorAvailabilitiesResponse;
import com.HealthConnect.Dto.DoctorResponse;
import com.HealthConnect.Dto.DoctorSlotDTO;
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
    
    // public Doctor updateDoctor(Long id, String address, LocalDate dateOfBirth, String email, String fullName, String gender, String phone) {
    //     userService.updateBasicInfo(id, address, dateOfBirth, email, fullName, gender, phone);
    //     Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
    // }
    public Doctor getById(Long id) {
        return doctorRepository.findById(id).orElseGet(null);
    }

    public DoctorAvailabilitiesResponse updateDoctorAvailability(Doctor doctor, List<AvailabilityDto> t) {
        List<DoctorAvailability> doctorAvailabilities = doctorAvailabilityRepository.findByDoctor(doctor);    
        doctorAvailabilityRepository.deleteAll(doctorAvailabilities);

        List <DoctorAvailability> newDoctorAvailabilities = t.stream().map(doctorAvailability -> {
            DoctorAvailability newDoctorAvailability = new DoctorAvailability();
            newDoctorAvailability.setDayOfWeek(doctorAvailability.getDayOfWeek());
            newDoctorAvailability.setStartTime(doctorAvailability.getStartTime());
            newDoctorAvailability.setEndTime(doctorAvailability.getEndTime());
            newDoctorAvailability.setDoctor(doctor);
            return newDoctorAvailability;
        }).toList();

        doctorAvailabilityRepository.saveAll(newDoctorAvailabilities);
        doctor.setAvailabilities(newDoctorAvailabilities);
        // Doctor d = doctorRepository.save(doctor);
        DoctorAvailabilitiesResponse response = new DoctorAvailabilitiesResponse();
        response.setDoctorId(doctor.getId());
        response.setAvailabilities(t);
        return response;
    }

    public DoctorResponse getAvailability(Long id) {
        Doctor doctor = doctorRepository.findById(id).orElseGet(null);
        
        DoctorResponse response = new DoctorResponse();
        response.setAvailabilities(doctor.getAvailabilities().stream().map(doctorAvailability -> {
            DoctorAvailability dto = new DoctorAvailability();
            dto.setDoctor(doctor);
            dto.setDayOfWeek(doctorAvailability.getDayOfWeek());
            dto.setStartTime(doctorAvailability.getStartTime());
            dto.setEndTime(doctorAvailability.getEndTime());
            return dto;
        }).toList());

        return response;
    }
    // private void create
    public List<DoctorSlotDTO> getAvailableSlot(Long id) {
        Doctor doctor = doctorRepository.findById(id).orElseGet(null);
        
        List<DoctorAvailability> availabilities = doctor.getAvailabilities();
        List<DoctorSlotDTO> savedSlots = new ArrayList<DoctorSlotDTO>();
        List<DoctorSlot> existingSlots = doctorSlotRepository.findByDoctorId(id);
        Set<String> existingSlotKeys = existingSlots.stream()
            .map(slot -> slot.getDate().toString() + "_" + slot.getStartTime().toString())
            .collect(Collectors.toSet());
        System.out.println(existingSlotKeys);

        Duration duration = Duration.ofMinutes(30);
        LocalDate currentDate = LocalDate.now();
        for (DoctorAvailability availability : availabilities) {
            LocalTime slotCurrenTime = availability.getStartTime();
            LocalTime slotEndTime = availability.getEndTime();
            while (slotCurrenTime.isBefore(slotEndTime) || slotCurrenTime.equals(slotEndTime)) {
                LocalDate slotDate = currentDate.plusDays(
                    (currentDate.getDayOfWeek().getValue() >  availability.getDayOfWeek().getValue() 
                    ? 8-currentDate.getDayOfWeek().getValue() :  availability.getDayOfWeek().getValue()-currentDate.getDayOfWeek().getValue())
                );
                // System.out.println(slotDate);
                if (slotDate.equals(currentDate) && (slotCurrenTime.isBefore(LocalTime.now()) || slotCurrenTime.equals(LocalTime.now()))) {
                    slotCurrenTime = LocalTime.now();
                    continue;
                }
                
                DoctorSlot.SlotStatus slotStatus = DoctorSlot.SlotStatus.AVAILABLE;
                if (!isSlotAvailable(doctor.getId(), slotDate, slotCurrenTime)) {
                    slotStatus = DoctorSlot.SlotStatus.BOOKED;
                }

                DoctorSlotDTO savedSlotDTO = new DoctorSlotDTO();
                savedSlotDTO.setDoctorId(doctor.getId());
                savedSlotDTO.setDate(slotDate);
                savedSlotDTO.setStartTime(slotCurrenTime);
                savedSlotDTO.setEndTime(slotCurrenTime.plusMinutes(30));
                savedSlotDTO.setDuration(duration);
                savedSlotDTO.setStatus(slotStatus.toString());
                savedSlots.add(savedSlotDTO);
                
                String slotKey = slotDate.toString() + "_" + slotCurrenTime.toString();
                if (!existingSlotKeys.contains(slotKey)) {
                    DoctorSlot slot = new DoctorSlot();
                    slot.setDoctor(doctor);
                    slot.setDate(slotDate);
                    slot.setStartTime(slotCurrenTime);
                    slot.setEndTime(slotCurrenTime.plusMinutes(30));
                    slot.setDuration(duration);
                    slot.setStatus(slotStatus);
                    doctorSlotRepository.save(slot);
                }
                slotCurrenTime = slotCurrenTime.plusMinutes(30);
            }
        }
        return savedSlots; 
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
