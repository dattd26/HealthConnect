package com.HealthConnect.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthConnect.Dto.AvailabilityDto;
import com.HealthConnect.Dto.DoctorAvailabilitiesResponse;
import com.HealthConnect.Dto.DoctorResponse;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.DoctorAvailability;
import com.HealthConnect.Repository.DoctorAvailabilityRepository;
import com.HealthConnect.Repository.DoctorRepository;

@Service
public class DoctorService {
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    DoctorAvailabilityRepository doctorAvailabilityRepository;

    public Doctor getDoctor(Long id) {
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

    public DoctorResponse getAvailableTimeslots(Long id) {
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
}
