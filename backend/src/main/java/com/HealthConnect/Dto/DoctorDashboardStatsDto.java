package com.HealthConnect.Dto;

import java.time.LocalDate;

public class DoctorDashboardStatsDto {
    private Long doctorId;
    private LocalDate startDate;
    private LocalDate endDate;
    
    // Appointment statistics
    private Long totalAppointments;
    private Long completedAppointments;
    private Long cancelledAppointments;
    private Long pendingAppointments;
    private Double completionRate;
    
    // Slot statistics
    private Long totalSlots;
    private Long availableSlots;
    private Long bookedSlots;
    private Double utilizationRate;
    
    // Revenue statistics (if applicable)
    private Double totalRevenue;
    private Double averageRevenuePerAppointment;
    
    // Patient statistics
    private Long uniquePatients;
    private Long newPatients;
    private Long returningPatients;
    
    public DoctorDashboardStatsDto() {}
    
    // Getters and Setters
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public Long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(Long totalAppointments) { this.totalAppointments = totalAppointments; }
    
    public Long getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(Long completedAppointments) { this.completedAppointments = completedAppointments; }
    
    public Long getCancelledAppointments() { return cancelledAppointments; }
    public void setCancelledAppointments(Long cancelledAppointments) { this.cancelledAppointments = cancelledAppointments; }
    
    public Long getPendingAppointments() { return pendingAppointments; }
    public void setPendingAppointments(Long pendingAppointments) { this.pendingAppointments = pendingAppointments; }
    
    public Double getCompletionRate() { return completionRate; }
    public void setCompletionRate(Double completionRate) { this.completionRate = completionRate; }
    
    public Long getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Long totalSlots) { this.totalSlots = totalSlots; }
    
    public Long getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Long availableSlots) { this.availableSlots = availableSlots; }
    
    public Long getBookedSlots() { return bookedSlots; }
    public void setBookedSlots(Long bookedSlots) { this.bookedSlots = bookedSlots; }
    
    public Double getUtilizationRate() { return utilizationRate; }
    public void setUtilizationRate(Double utilizationRate) { this.utilizationRate = utilizationRate; }
    
    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }
    
    public Double getAverageRevenuePerAppointment() { return averageRevenuePerAppointment; }
    public void setAverageRevenuePerAppointment(Double averageRevenuePerAppointment) { this.averageRevenuePerAppointment = averageRevenuePerAppointment; }
    
    public Long getUniquePatients() { return uniquePatients; }
    public void setUniquePatients(Long uniquePatients) { this.uniquePatients = uniquePatients; }
    
    public Long getNewPatients() { return newPatients; }
    public void setNewPatients(Long newPatients) { this.newPatients = newPatients; }
    
    public Long getReturningPatients() { return returningPatients; }
    public void setReturningPatients(Long returningPatients) { this.returningPatients = returningPatients; }
}
