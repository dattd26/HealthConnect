package com.HealthConnect.Dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Duration;

public class AppointmentWithPatientDto {
    private Long id;
    private PatientDto patient;
    private DoctorSlotDto doctorSlot;
    private String status;
    private String notes;
    private String zoomMeetingId;
    private String zoomJoinUrl;
    private String zoomStartUrl;
    private String zoomPassword;

    public AppointmentWithPatientDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PatientDto getPatient() { return patient; }
    public void setPatient(PatientDto patient) { this.patient = patient; }

    public DoctorSlotDto getDoctorSlot() { return doctorSlot; }
    public void setDoctorSlot(DoctorSlotDto doctorSlot) { this.doctorSlot = doctorSlot; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getZoomMeetingId() { return zoomMeetingId; }
    public void setZoomMeetingId(String zoomMeetingId) { this.zoomMeetingId = zoomMeetingId; }

    public String getZoomJoinUrl() { return zoomJoinUrl; }
    public void setZoomJoinUrl(String zoomJoinUrl) { this.zoomJoinUrl = zoomJoinUrl; }

    public String getZoomStartUrl() { return zoomStartUrl; }
    public void setZoomStartUrl(String zoomStartUrl) { this.zoomStartUrl = zoomStartUrl; }

    public String getZoomPassword() { return zoomPassword; }
    public void setZoomPassword(String zoomPassword) { this.zoomPassword = zoomPassword; }

    // Inner DTOs
    public static class PatientDto {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String gender;
        private LocalDate dateOfBirth;

        public PatientDto() {}

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public LocalDate getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    }

    public static class DoctorSlotDto {
        private Long id;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
        private Duration duration;
        private String status;

        public DoctorSlotDto() {}


        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public LocalTime getStartTime() { return startTime; }
        public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

        public LocalTime getEndTime() { return endTime; }
        public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

        public Duration getDuration() { return duration; }
        public void setDuration(Duration duration) { this.duration = duration; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
