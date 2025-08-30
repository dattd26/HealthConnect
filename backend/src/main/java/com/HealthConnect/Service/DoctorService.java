package com.HealthConnect.Service;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

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
import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.Appointment.AppointmentStatus;

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

    // Get dashboard statistics
    public Map<String, Object> getDashboardStatistics(Long doctorId, int days) {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);
        
        // Get appointment statistics
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctorAndDateRange(doctorId, startDate, endDate);
        
        long totalAppointments = appointments.size();
        long confirmedAppointments = appointments.stream()
                .filter(a -> AppointmentStatus.CONFIRMED.equals(a.getStatus()))
                .count();
        long cancelledAppointments = appointments.stream()
                .filter(a -> AppointmentStatus.CANCELLED.equals(a.getStatus()))
                .count();
        long pendingAppointments = appointments.stream()
                .filter(a -> AppointmentStatus.PENDING_PAYMENT.equals(a.getStatus()) || 
                           AppointmentStatus.PAYMENT_PENDING.equals(a.getStatus()))
                .count();
        
        stats.put("totalAppointments", totalAppointments);
        stats.put("confirmedAppointments", confirmedAppointments);
        stats.put("cancelledAppointments", cancelledAppointments);
        stats.put("waitingAppointments", pendingAppointments);
        stats.put("completionRate", totalAppointments > 0 ? (double) confirmedAppointments / totalAppointments : 0);
        
        // Get slot statistics
        List<DoctorSlot> slots = doctorSlotRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);
        long totalSlots = slots.size();
        long availableSlots = slots.stream()
                .filter(slot -> "AVAILABLE".equals(slot.getStatus()))
                .count();
        long bookedSlots = slots.stream()
                .filter(slot -> "BOOKED".equals(slot.getStatus()))
                .count();
        
        stats.put("totalSlots", totalSlots);
        stats.put("availableSlots", availableSlots);
        stats.put("bookedSlots", bookedSlots);
        stats.put("utilizationRate", totalSlots > 0 ? (double) bookedSlots / totalSlots : 0);
        
        return stats;
    }

    // Get appointment calendar
    public Map<String, Object> getAppointmentCalendar(Long doctorId, LocalDate month, boolean includeSlots) {
        Map<String, Object> calendar = new HashMap<>();
        
        LocalDate startOfMonth = month.withDayOfMonth(1);
        LocalDate endOfMonth = month.withDayOfMonth(month.lengthOfMonth());
        
        List<Appointment> monthAppointments = appointmentService.getAppointmentsByDoctorAndDateRange(doctorId, startOfMonth, endOfMonth);
        List<DoctorSlot> monthSlots = doctorSlotRepository.findByDoctorIdAndDateBetween(doctorId, startOfMonth, endOfMonth);
        
        // Group appointments by date
        Map<LocalDate, List<Appointment>> appointmentsByDate = monthAppointments.stream()
                .collect(Collectors.groupingBy(a -> a.getDoctorSlot().getDate()));
        
        // Group slots by date
        Map<LocalDate, List<DoctorSlot>> slotsByDate = monthSlots.stream()
                .collect(Collectors.groupingBy(DoctorSlot::getDate));
        
        calendar.put("month", month);
        calendar.put("appointmentsByDate", appointmentsByDate);
        if (includeSlots) {
            calendar.put("slotsByDate", slotsByDate);
        }
        
        return calendar;
    }

    // Get patient health records for appointment
    public Map<String, Object> getPatientHealthRecordsForAppointment(Long doctorId, Long appointmentId) {
        Map<String, Object> records = new HashMap<>();
        
        // This would typically involve getting patient health data
        // For now, returning basic structure
        records.put("appointmentId", appointmentId);
        records.put("patientRecords", new ArrayList<>());
        records.put("healthMetrics", new HashMap<>());
        
        return records;
    }

    // Get doctor schedule for specific date
    public Map<String, Object> getDoctorSchedule(Long doctorId, LocalDate date) {
        Map<String, Object> schedule = new HashMap<>();
        
        List<DoctorSlot> daySlots = doctorSlotRepository.findByDoctorIdAndDate(doctorId, date);
        List<Appointment> dayAppointments = appointmentService.getAppointmentsByDoctorAndDate(doctorId, date);
        
        schedule.put("date", date);
        schedule.put("slots", daySlots);
        schedule.put("appointments", dayAppointments);
        
        return schedule;
    }

    // Get weekly schedule
    public Map<String, Object> getWeeklySchedule(Long doctorId, LocalDate weekStart) {
        Map<String, Object> weeklySchedule = new HashMap<>();
        
        LocalDate weekEnd = weekStart.plusDays(6);
        List<DoctorSlot> weekSlots = doctorSlotRepository.findByDoctorIdAndDateBetween(doctorId, weekStart, weekEnd);
        List<Appointment> weekAppointments = appointmentService.getAppointmentsByDoctorAndDateRange(doctorId, weekStart, weekEnd);
        
        // Group by day
        Map<LocalDate, List<DoctorSlot>> slotsByDay = weekSlots.stream()
                .collect(Collectors.groupingBy(DoctorSlot::getDate));
        Map<LocalDate, List<Appointment>> appointmentsByDay = weekAppointments.stream()
                .collect(Collectors.groupingBy(a -> a.getDoctorSlot().getDate()));
        
        weeklySchedule.put("weekStart", weekStart);
        weeklySchedule.put("weekEnd", weekEnd);
        weeklySchedule.put("slotsByDay", slotsByDay);
        weeklySchedule.put("appointmentsByDay", appointmentsByDay);
        
        return weeklySchedule;
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
    
    // New method for updating doctor profile
    public Doctor updateDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }
}
