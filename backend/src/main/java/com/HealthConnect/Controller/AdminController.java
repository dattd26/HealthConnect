package com.HealthConnect.Controller;

import com.HealthConnect.Dto.*;
import com.HealthConnect.Model.Admin;
import com.HealthConnect.Model.User;
import com.HealthConnect.Service.AdminService;
import com.HealthConnect.Service.MedicalSpecialtyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private MedicalSpecialtyService specialtyService;

    // Quản lý yêu cầu đăng ký bác sĩ
    @GetMapping("/doctor-requests")
    public ResponseEntity<List<DoctorRequestDTO>> getPendingDoctorRequests() {
        List<DoctorRequestDTO> requests = adminService.getPendingDoctorRequests();
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/doctor-requests/{requestId}/approve")
    public ResponseEntity<String> approveDoctorRequest(@PathVariable Long requestId) {
        adminService.approveDoctorRequest(requestId);
        return ResponseEntity.ok("Yêu cầu đăng ký bác sĩ đã được phê duyệt");
    }

    @PostMapping("/doctor-requests/{requestId}/reject")
    public ResponseEntity<String> rejectDoctorRequest(@PathVariable Long requestId, @RequestBody RejectRequestDTO rejectReason) {
        adminService.rejectDoctorRequest(requestId, rejectReason.getReason());
        return ResponseEntity.ok("Yêu cầu đăng ký bác sĩ đã bị từ chối");
    }

    // Quản lý chuyên khoa
    @PostMapping("/specialties")
    public ResponseEntity<MedicalSpecialtyDTO> createSpecialty(@RequestBody CreateSpecialtyDTO request) {
        MedicalSpecialtyDTO specialty = adminService.createSpecialty(request);
        return ResponseEntity.ok(specialty);
    }

    @PutMapping("/specialties/{id}")
    public ResponseEntity<MedicalSpecialtyDTO> updateSpecialty(@PathVariable Long id, @RequestBody UpdateSpecialtyDTO request) {
        MedicalSpecialtyDTO specialty = adminService.updateSpecialty(id, request);
        return ResponseEntity.ok(specialty);
    }

    @DeleteMapping("/specialties/{id}")
    public ResponseEntity<String> deleteSpecialty(@PathVariable Long id) {
        adminService.deleteSpecialty(id);
        return ResponseEntity.ok("Chuyên khoa đã được xóa");
    }

    @GetMapping("/specialties")
    public ResponseEntity<List<MedicalSpecialtyDTO>> getAllSpecialties() {
        List<MedicalSpecialtyDTO> specialties = adminService.getAllSpecialties();
        return ResponseEntity.ok(specialties);
    }

    // Quản lý người dùng
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}/verify")
    public ResponseEntity<String> verifyUser(@PathVariable Long id) {
        adminService.verifyUser(id);
        return ResponseEntity.ok("Người dùng đã được xác thực");
    }

    @PutMapping("/users/{id}/block")
    public ResponseEntity<String> blockUser(@PathVariable Long id) {
        adminService.blockUser(id);
        return ResponseEntity.ok("Người dùng đã bị khóa");
    }

    @PutMapping("/users/{id}/unblock")
    public ResponseEntity<String> unblockUser(@PathVariable Long id) {
        adminService.unblockUser(id);
        return ResponseEntity.ok("Người dùng đã được mở khóa");
    }

    // Thống kê tổng quan
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    // Quản lý vai trò người dùng
    @PutMapping("/users/{id}/role")
    public ResponseEntity<String> updateUserRole(@PathVariable Long id, @RequestBody UpdateRoleDTO request) {
        adminService.updateUserRole(id, request.getRole());
        return ResponseEntity.ok("Vai trò người dùng đã được cập nhật");
    }

    // Quản lý Admin
    @GetMapping("/admins")
    public ResponseEntity<List<AdminDTO>> getAllAdmins() {
        List<AdminDTO> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/admins/{id}")
    public ResponseEntity<AdminDTO> getAdminById(@PathVariable Long id) {
        AdminDTO admin = adminService.getAdminById(id);
        return ResponseEntity.ok(admin);
    }

    @PostMapping("/admins")
    public ResponseEntity<AdminDTO> createAdmin(@RequestBody CreateAdminDTO createAdminDTO) {
        AdminDTO admin = adminService.createAdminFromDTO(createAdminDTO);
        return ResponseEntity.ok(admin);
    }

    @PutMapping("/admins/{id}")
    public ResponseEntity<AdminDTO> updateAdmin(@PathVariable Long id, @RequestBody UpdateAdminDTO updateAdminDTO) {
        Admin adminDetails = new Admin();
        adminDetails.setFullName(updateAdminDTO.getFullName());
        adminDetails.setEmail(updateAdminDTO.getEmail());
        adminDetails.setPhone(updateAdminDTO.getPhone());
        adminDetails.setDepartment(updateAdminDTO.getDepartment());
        adminDetails.setPermissions(updateAdminDTO.getPermissions());
        
        AdminDTO admin = adminService.updateAdmin(id, adminDetails);
        return ResponseEntity.ok(admin);
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok("Admin đã được xóa");
    }
}
