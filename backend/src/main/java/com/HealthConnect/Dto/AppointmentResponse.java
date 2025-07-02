package com.HealthConnect.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@NoArgsConstructor
@Setter
public class AppointmentResponse {
    private Long id;
    private String doctorName;
    // private PatientResponse patient;
    private String date;
    private String time;
    private DoctorSlotDTO doctorSlot;
    private String notes;
    private String status;

    // Zoom meeting info
    private String zoomJoinUrl;
    private String zoomStartUrl;
    private String zoomMeetingId;
    private String zoomPassword;
}

