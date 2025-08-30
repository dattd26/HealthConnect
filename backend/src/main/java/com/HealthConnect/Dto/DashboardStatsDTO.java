package com.HealthConnect.Dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    private Long totalUsers;
    private Long totalDoctors;
    private Long totalPatients;
    private Long pendingDoctorRequests;
    private Long totalAppointments;
    private Long totalSpecialties;
    private Long verifiedUsers;
    private Long blockedUsers;
}
