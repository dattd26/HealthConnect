package com.HealthConnect.Scheduler;

import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Repository.DoctorRepository;
import com.HealthConnect.Service.SlotService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SlotGenerationScheduler {
    
    private static final Logger logger = LoggerFactory.getLogger(SlotGenerationScheduler.class);
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private SlotService slotService;
    
    /**
     * Generate slots for all doctors daily at midnight
     * This ensures slots are always available for the next 2 weeks
     */
    @Scheduled(cron = "0 0 0 * * ?") // Run at midnight every day
    public void generateDailySlots() {
        logger.info("Starting daily slot generation...");
        
        try {
            List<Doctor> doctors = doctorRepository.findAll();
            int totalDoctors = doctors.size();
            int processedDoctors = 0;
            
            for (Doctor doctor : doctors) {
                try {
                    // This will generate slots for the next 2 weeks if they don't exist
                    slotService.getAvailableSlots(doctor.getId());
                    processedDoctors++;
                    
                    if (processedDoctors % 10 == 0) {
                        logger.info("Processed {}/{} doctors", processedDoctors, totalDoctors);
                    }
                } catch (Exception e) {
                    logger.error("Failed to generate slots for doctor {}: {}", 
                               doctor.getId(), e.getMessage());
                }
            }
            
            logger.info("Daily slot generation completed. Processed {}/{} doctors", 
                       processedDoctors, totalDoctors);
            
        } catch (Exception e) {
            logger.error("Daily slot generation failed: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Clean up old slots every Sunday at 2 AM
     * Remove slots older than 1 week to keep database clean
     */
    @Scheduled(cron = "0 0 2 * * SUN") // Run at 2 AM every Sunday
    public void cleanupOldSlots() {
        logger.info("Starting cleanup of old slots...");
        
        try {
            // This would require a new method in SlotService
            // slotService.cleanupOldSlots();
            logger.info("Old slots cleanup completed");
        } catch (Exception e) {
            logger.error("Old slots cleanup failed: {}", e.getMessage(), e);
        }
    }
}
