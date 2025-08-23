package com.HealthConnect.Controller;

import com.HealthConnect.Dto.DoctorSlotDTO;
import com.HealthConnect.Service.SlotService;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/slots")
public class SlotController {
    
    @Autowired
    private SlotService slotService;
    

    @GetMapping("/doctor/{doctorId}/available")
    public ResponseEntity<Map<String, List<DoctorSlotDTO>>> getAvailableSlotsByDate(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long doctorId) {
        
        List<DoctorSlotDTO> slots = slotService.getAvailableSlots(doctorId);
        
        // Group slots by date for easier frontend consumption
        Map<String, List<DoctorSlotDTO>> slotsByDate = slots.stream()
                .filter(slot -> "AVAILABLE".equals(slot.getStatus()))
                .collect(Collectors.groupingBy(
                    slot -> slot.getDate().toString(),
                    Collectors.toList()
                ));
        
        return ResponseEntity.ok(slotsByDate);
    }
    

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorSlotDTO>> getSlotsByDateRange(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String status) {
        
        List<DoctorSlotDTO> slots = slotService.getSlotsByDateRange(doctorId, startDate, endDate);
        
        if (status != null && !status.isEmpty()) {
            slots = slots.stream()
                    .filter(slot -> status.equalsIgnoreCase(slot.getStatus()))
                    .collect(Collectors.toList());
        }
        
        return ResponseEntity.ok(slots);
    }
    
 
    @GetMapping("/doctor/{doctorId}/summary")
    public ResponseEntity<Map<String, Long>> getSlotSummary(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long doctorId,
            @RequestParam(defaultValue = "7") int days) {
        
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(days);
        
        List<DoctorSlotDTO> slots = slotService.getSlotsByDateRange(doctorId, startDate, endDate);
        
        Map<String, Long> summary = slots.stream()
                .filter(slot -> "AVAILABLE".equals(slot.getStatus()))
                .collect(Collectors.groupingBy(
                    slot -> slot.getDate().toString(),
                    Collectors.counting()
                ));
        
        return ResponseEntity.ok(summary);
    }

    /**
     * Clean up duplicate slots for a doctor
     */
    @PostMapping("/doctor/{doctorId}/cleanup")
    public ResponseEntity<Map<String, String>> cleanupDuplicateSlots(
            @PathVariable @Positive(message = "Doctor ID must be positive") Long doctorId) {
        
        try {
            slotService.cleanupDuplicateSlots(doctorId);
            return ResponseEntity.ok(Map.of(
                "message", "Duplicate slots cleaned up successfully",
                "doctorId", doctorId.toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "error", "Failed to cleanup duplicate slots",
                        "message", e.getMessage()
                    ));
        }
    }
}
