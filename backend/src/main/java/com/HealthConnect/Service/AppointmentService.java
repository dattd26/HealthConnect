package com.HealthConnect.Service;

import com.HealthConnect.Dto.AppointmentResponse;
import com.HealthConnect.Dto.DoctorSlotDTO;
import com.HealthConnect.Model.Appointment;
import com.HealthConnect.Model.DoctorSlot;
import com.HealthConnect.Model.User;
import com.HealthConnect.Repository.AppointmentRepository;
import com.HealthConnect.Model.Appointment.AppointmentStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private SlotService slotService;
    
    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Transactional
    public Appointment createAppointment(Appointment appointment) {
        // Validate appointment time
        validateAppointmentTime(appointment);
        
        // Set initial status
        appointment.setStatus(AppointmentStatus.PENDING_PAYMENT);
        
        return appointmentRepository.save(appointment);
    }
    
    private void validateAppointmentTime(Appointment appointment) {
        LocalDateTime appointmentDateTime = LocalDateTime.of(
            appointment.getDoctorSlot().getDate(), 
            appointment.getDoctorSlot().getStartTime()
        );
        
        // Không cho phép đặt lịch trong quá khứ
        if (appointmentDateTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Không thể đặt lịch hẹn trong quá khứ");
        }
        
        // Không cho phép đặt lịch quá sớm (trước 24h)
        if (appointmentDateTime.isBefore(LocalDateTime.now().plusHours(24))) {
            throw new RuntimeException("Cần đặt lịch hẹn trước ít nhất 24 giờ");
        }
        
        // Không cho phép đặt lịch quá xa (trước 30 ngày)
        if (appointmentDateTime.isAfter(LocalDateTime.now().plusDays(30))) {
            throw new RuntimeException("Không thể đặt lịch hẹn trước quá 30 ngày");
        }
    }

    @Transactional
    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Lịch hẹn không tồn tại"));
        
        // Chỉ cho phép hủy khi chưa thanh toán hoặc chưa xác nhận
        if (appointment.getStatus() == AppointmentStatus.CONFIRMED || 
            appointment.getStatus() == AppointmentStatus.IN_PROGRESS) {
            throw new RuntimeException("Không thể hủy lịch hẹn đã được xác nhận");
        }
        
        appointment.setStatus(AppointmentStatus.CANCELLED);
        
        // Giải phóng slot nếu đã được xác nhận
        if (appointment.getStatus() == AppointmentStatus.CONFIRMED) {
            DoctorSlot slot = appointment.getDoctorSlot();
            slotService.releaseSlot(slot.getDoctor().getId(), slot.getDate(), slot.getStartTime());
        }
        
        appointmentRepository.save(appointment);
    }
    
    @Transactional
    public Appointment confirmAppointment(Long appointmentId) {
        Appointment appointment = getAppointmentById(appointmentId);
        
        if (appointment.getStatus() != AppointmentStatus.PAYMENT_PENDING) {
            throw new RuntimeException("Chỉ có thể xác nhận lịch hẹn đã thanh toán");
        }
        
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        return appointmentRepository.save(appointment);
    }
    
    @Transactional
    public Appointment startAppointment(Long appointmentId) {
        Appointment appointment = getAppointmentById(appointmentId);
        
        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new RuntimeException("Chỉ có thể bắt đầu lịch hẹn đã được xác nhận");
        }
        
        // Kiểm tra thời gian hiện tại có phù hợp không
        LocalDateTime appointmentTime = LocalDateTime.of(
            appointment.getDoctorSlot().getDate(), 
            appointment.getDoctorSlot().getStartTime()
        );
        
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(appointmentTime.minusMinutes(15))) {
            throw new RuntimeException("Chưa đến thời gian khám bệnh");
        }
        
        if (now.isAfter(appointmentTime.plusMinutes(30))) {
            appointment.setStatus(AppointmentStatus.NO_SHOW);
            return appointmentRepository.save(appointment);
        }
        
        appointment.setStatus(AppointmentStatus.IN_PROGRESS);
        return appointmentRepository.save(appointment);
    }
    
    @Transactional
    public Appointment completeAppointment(Long appointmentId) {
        Appointment appointment = getAppointmentById(appointmentId);
        
        if (appointment.getStatus() != AppointmentStatus.IN_PROGRESS) {
            throw new RuntimeException("Chỉ có thể hoàn thành lịch hẹn đang diễn ra");
        }
        
        appointment.setStatus(AppointmentStatus.COMPLETED);
        return appointmentRepository.save(appointment);
    }
    
    @Transactional
    public void expireAppointments() {
        LocalDateTime now = LocalDateTime.now();
        LocalDate cutoffDate = now.minusMinutes(30).toLocalDate();
        
        List<Appointment> expiredAppointments = appointmentRepository
            .findByStatusAndDateTimeBefore(AppointmentStatus.CONFIRMED, cutoffDate);
        
        for (Appointment appointment : expiredAppointments) {
            appointment.setStatus(AppointmentStatus.EXPIRED);
            appointmentRepository.save(appointment);
        }
    }

    public List<AppointmentResponse> getAppointmentsByUser(User user) {
        List<Appointment> appointments = appointmentRepository.findByPatientOrDoctor(user, user);
        return appointments.stream().map(appointment -> {
            AppointmentResponse response = new AppointmentResponse();
            response.setId(appointment.getId());
            response.setDoctorName(appointment.getDoctor().getFullName());
            response.setDate(appointment.getDoctorSlot().getDate().toString());
            response.setTime(appointment.getDoctorSlot().getStartTime().toString());
            DoctorSlot doctorSlot = appointment.getDoctorSlot();
            DoctorSlotDTO doctorSlotResponse = new DoctorSlotDTO();
            doctorSlotResponse.setDoctorId(doctorSlot.getDoctor().getId());
            doctorSlotResponse.setDate(doctorSlot.getDate());
            doctorSlotResponse.setStartTime(doctorSlot.getStartTime());
            doctorSlotResponse.setEndTime(doctorSlot.getEndTime());
            doctorSlotResponse.setDuration(doctorSlot.getDuration());
            doctorSlotResponse.setStatus(doctorSlot.getStatus().toString());
            response.setDoctorSlot(doctorSlotResponse);
            response.setNotes(appointment.getNotes());
            response.setStatus(appointment.getStatus().toString());
            return response;
        }).collect(Collectors.toList());
    }

    public Appointment getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }
    
    // New methods for doctor dashboard
    public List<Appointment> getTodayAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorIdAndDate(doctorId, LocalDate.now());
    }
    
    public List<Appointment> getUpcomingAppointmentsByDoctor(Long doctorId, int days) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(days);
        return appointmentRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);
    }
    
    public List<Appointment> getAppointmentsByDoctorAndDate(Long doctorId, LocalDate date) {
        return appointmentRepository.findByDoctorIdAndDate(doctorId, date);
    }
    
    public List<Appointment> getAppointmentsByDoctorAndStatus(Long doctorId, String status) {
        AppointmentStatus appointmentStatus = AppointmentStatus.valueOf(status.toUpperCase());
        return appointmentRepository.findByDoctorIdAndStatus(doctorId, appointmentStatus);
    }

    // Get appointments by doctor and date range
    public List<Appointment> getAppointmentsByDoctorAndDateRange(Long doctorId, LocalDate startDate, LocalDate endDate) {
        return appointmentRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);
    }
    
    // Get all appointments by doctor with details
    public List<Appointment> getAppointmentsByDoctorWithDetails(Long doctorId) {
        return appointmentRepository.findByDoctorIdWithDetails(doctorId);
    }

    // Update appointment status
    public Appointment updateAppointmentStatus(Long appointmentId, String status) {
        Appointment appointment = getAppointmentById(appointmentId);
        appointment.setStatus(AppointmentStatus.valueOf(status.toUpperCase()));
        return appointmentRepository.save(appointment);
    }
}