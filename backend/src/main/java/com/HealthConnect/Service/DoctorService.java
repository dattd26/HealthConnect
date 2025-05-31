package com.HealthConnect.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthConnect.Dto.DoctorResponse;
import com.HealthConnect.Dto.DoctorTimeSlotDTO;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.DoctorTimeslot;
import com.HealthConnect.Repository.DoctorRepository;
import com.HealthConnect.Repository.DoctorTimeSlotRepository;

@Service
public class DoctorService {
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    DoctorTimeSlotRepository timeSlotRepository;

    public Doctor getDoctor(Long id) {
        return doctorRepository.findById(id).orElseGet(null);
    }
    public DoctorResponse updateTimeSlots(Doctor doctor, List<DoctorTimeSlotDTO> t) {
        List<DoctorTimeslot> existingTimeSlots = timeSlotRepository.findByDoctor(doctor);    
        timeSlotRepository.deleteAll(existingTimeSlots);

        List <DoctorTimeslot> newTimeSlots = t.stream().map(timeslot -> {
            DoctorTimeslot newTimeSlot = new DoctorTimeslot();
            newTimeSlot.setDayOfWeek(timeslot.getDayOfWeek());
            newTimeSlot.setStartTime(timeslot.getStartTime());
            newTimeSlot.setEndTime(timeslot.getEndTime());
            newTimeSlot.setDuration(timeslot.getDuration());
            newTimeSlot.setDoctor(doctor);
            return newTimeSlot;
        }).toList();

        timeSlotRepository.saveAll(newTimeSlots);
        doctor.setTimeslots(new ArrayList<>(newTimeSlots));
        // Doctor d = doctorRepository.save(doctor);
        DoctorResponse response = new DoctorResponse();
        response.setTimeslots(t);
        return response;
    }

    public DoctorResponse getAvailableTimeslots(Long id) {
        Doctor doctor = doctorRepository.findById(id).orElseGet(null);
        
        DoctorResponse response = new DoctorResponse();
        response.setTimeslots(doctor.getTimeslots().stream().map(timeslot -> {
            DoctorTimeSlotDTO dto = new DoctorTimeSlotDTO();
            dto.setDayOfWeek(timeslot.getDayOfWeek());
            dto.setStartTime(timeslot.getStartTime());
            dto.setEndTime(timeslot.getEndTime());
            dto.setDuration(timeslot.getDuration());
            return dto;
        }).toList());

        return response;
    }
}
