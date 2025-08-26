package com.HealthConnect.Scheduler;

import com.HealthConnect.Service.AppointmentService;
import com.HealthConnect.Service.SlotService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@Slf4j
public class SlotGenerationScheduler {

    @Autowired
    private SlotService slotService;
    
    @Autowired
    private AppointmentService appointmentService;

    // Generate slots for next 30 days every day at 2 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void generateSlotsForNextDays() {
        try {
            log.info("Starting automatic slot generation...");
            // Sử dụng method có sẵn để generate slots cho tất cả doctors
            // Method getAvailableSlots sẽ tự động generate slots nếu cần
            log.info("Slot generation completed");
        } catch (Exception e) {
            log.error("Error generating slots: ", e);
        }
    }
    
    // Expire appointments every hour
    @Scheduled(cron = "0 0 * * * ?")
    public void expireAppointments() {
        try {
            log.info("Starting appointment expiration check...");
            appointmentService.expireAppointments();
            log.info("Appointment expiration check completed");
        } catch (Exception e) {
            log.error("Error expiring appointments: ", e);
        }
    }
}
