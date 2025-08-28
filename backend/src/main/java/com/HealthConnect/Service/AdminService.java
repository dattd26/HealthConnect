package com.HealthConnect.Service;

import com.HealthConnect.Dto.*;
import com.HealthConnect.Model.Admin;
import com.HealthConnect.Model.Doctor;
import com.HealthConnect.Model.MedicalSpecialty;
import com.HealthConnect.Model.User;
import com.HealthConnect.Repository.AdminRepository;
import com.HealthConnect.Repository.DoctorRepository;
import com.HealthConnect.Repository.MedicalSpecialtyRepository;
import com.HealthConnect.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private MedicalSpecialtyRepository specialtyRepository;

    // Admin management methods
    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(this::convertToAdminDTO)
                .collect(Collectors.toList());
    }

    public AdminDTO getAdminById(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin không tồn tại"));
        return convertToAdminDTO(admin);
    }

    public AdminDTO getAdminByUsername(String username) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin không tồn tại"));
        return convertToAdminDTO(admin);
    }

    public AdminDTO createAdmin(Admin admin) {
        if (adminRepository.existsByUsername(admin.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        Admin savedAdmin = adminRepository.save(admin);
        return convertToAdminDTO(savedAdmin);
    }

    public AdminDTO createAdminFromDTO(CreateAdminDTO createAdminDTO) {
        if (adminRepository.existsByUsername(createAdminDTO.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (adminRepository.existsByEmail(createAdminDTO.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        
        Admin admin = new Admin(
            createAdminDTO.getFullName(),
            createAdminDTO.getUsername(),
            createAdminDTO.getEmail(),
            createAdminDTO.getPhone(),
            createAdminDTO.getPassword()
        );
        admin.setDepartment(createAdminDTO.getDepartment());
        admin.setPermissions(createAdminDTO.getPermissions());
        
        Admin savedAdmin = adminRepository.save(admin);
        return convertToAdminDTO(savedAdmin);
    }

    public AdminDTO updateAdmin(Long id, Admin adminDetails) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin không tồn tại"));
        admin.setFullName(adminDetails.getFullName());
        admin.setEmail(adminDetails.getEmail());
        admin.setPhone(adminDetails.getPhone());
        admin.setDepartment(adminDetails.getDepartment());
        admin.setPermissions(adminDetails.getPermissions());
        Admin updatedAdmin = adminRepository.save(admin);
        return convertToAdminDTO(updatedAdmin);
    }

    public void deleteAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin không tồn tại"));
        adminRepository.delete(admin);
    }

    // Lấy danh sách yêu cầu đăng ký bác sĩ đang chờ
    public List<DoctorRequestDTO> getPendingDoctorRequests() {
        List<Doctor> pendingDoctors = doctorRepository.findAllByRole("DOCTOR")
                .stream()
                .filter(doctor -> !doctor.isVerified())
                .collect(Collectors.toList());

        return pendingDoctors.stream()
                .map(this::convertToDoctorRequestDTO)
                .collect(Collectors.toList());
    }

    // Phê duyệt yêu cầu đăng ký bác sĩ
    public void approveDoctorRequest(Long requestId) {
        Doctor doctor = doctorRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Bác sĩ không tồn tại"));
        
        doctor.setVerified(true);
        doctorRepository.save(doctor);
    }

    // Từ chối yêu cầu đăng ký bác sĩ
    public void rejectDoctorRequest(Long requestId, String reason) {
        Doctor doctor = doctorRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Bác sĩ không tồn tại"));
        
        // Có thể thêm logic để lưu lý do từ chối
        // doctor.setRejectReason(reason);
        doctorRepository.delete(doctor); // Xóa yêu cầu bị từ chối
    }

    // Tạo chuyên khoa mới
    public MedicalSpecialtyDTO createSpecialty(CreateSpecialtyDTO request) {
        MedicalSpecialty specialty = new MedicalSpecialty();
        specialty.setName(request.getName());
        specialty.setDescription(request.getDescription());
        specialty.setCode(request.getCode());
        
        specialty = specialtyRepository.save(specialty);
        return convertToMedicalSpecialtyDTO(specialty);
    }

    // Cập nhật chuyên khoa
    public MedicalSpecialtyDTO updateSpecialty(Long id, UpdateSpecialtyDTO request) {
        MedicalSpecialty specialty = specialtyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chuyên khoa không tồn tại"));
        
        specialty.setName(request.getName());
        specialty.setDescription(request.getDescription());
        specialty.setCode(request.getCode());
        
        specialty = specialtyRepository.save(specialty);
        return convertToMedicalSpecialtyDTO(specialty);
    }

    // Xóa chuyên khoa
    public void deleteSpecialty(Long id) {
        MedicalSpecialty specialty = specialtyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chuyên khoa không tồn tại"));
        
        specialtyRepository.delete(specialty);
    }

    // Lấy tất cả chuyên khoa
    public List<MedicalSpecialtyDTO> getAllSpecialties() {
        List<MedicalSpecialty> specialties = specialtyRepository.findAll();
        return specialties.stream()
                .map(this::convertToMedicalSpecialtyDTO)
                .collect(Collectors.toList());
    }

    // Lấy tất cả người dùng
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    // Lấy người dùng theo ID
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        return convertToUserDTO(user);
    }

    // Xác thực người dùng
    public void verifyUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        
        user.setVerified(true);
        userRepository.save(user);
    }

    // Khóa người dùng
    public void blockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        
        user.setBlocked(true);
        userRepository.save(user);
    }

    // Mở khóa người dùng
    public void unblockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        
        user.setBlocked(false);
        userRepository.save(user);
    }

    // Cập nhật vai trò người dùng
    public void updateUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        
        user.setRole(role);
        userRepository.save(user);
    }

    // Lấy thống kê dashboard
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        stats.setTotalUsers((long) userRepository.findAll().size());
        stats.setTotalDoctors((long) doctorRepository.findAllByRole("DOCTOR").size());
        stats.setTotalPatients((long) userRepository.findAllByRole("PATIENT").size());
        stats.setPendingDoctorRequests((long) getPendingDoctorRequests().size());
        stats.setTotalSpecialties((long) specialtyRepository.findAll().size());
        stats.setVerifiedUsers((long) userRepository.findAll().stream().filter(User::isVerified).count());
        stats.setBlockedUsers((long) userRepository.findAll().stream().filter(User::isBlocked).count());
        
        return stats;
    }

    // Helper methods để convert entities sang DTOs
    private DoctorRequestDTO convertToDoctorRequestDTO(Doctor doctor) {
        DoctorRequestDTO dto = new DoctorRequestDTO();
        dto.setId(doctor.getId());
        dto.setFullName(doctor.getFullName());
        dto.setUsername(doctor.getUsername());
        dto.setEmail(doctor.getEmail());
        dto.setPhone(doctor.getPhone());
        dto.setLicense(doctor.getLicense());
        dto.setHospital(doctor.getHospital());
        dto.setStatus(doctor.isVerified() ? "APPROVED" : "PENDING");
        dto.setRequestDate(LocalDateTime.now()); // Có thể thêm trường này vào Doctor entity
        
        return dto;
    }

    private MedicalSpecialtyDTO convertToMedicalSpecialtyDTO(MedicalSpecialty specialty) {
        MedicalSpecialtyDTO dto = new MedicalSpecialtyDTO();
        dto.setId(specialty.getId());
        dto.setName(specialty.getName());
        dto.setDescription(specialty.getDescription());
        dto.setCode(specialty.getCode());
        
        return dto;
    }

    private UserDTO convertToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .role(user.getRole())
                .isVerified(user.isVerified())
                .build();
    }

    // Helper method để convert Admin entity sang AdminDTO
    private AdminDTO convertToAdminDTO(Admin admin) {
        return AdminDTO.builder()
                .id(admin.getId())
                .fullName(admin.getFullName())
                .username(admin.getUsername())
                .dateOfBirth(admin.getDateOfBirth())
                .address(admin.getAddress())
                .email(admin.getEmail())
                .phone(admin.getPhone())
                .gender(admin.getGender())
                .role(admin.getRole())
                .isVerified(admin.isVerified())
                .isBlocked(admin.isBlocked())
                .department(admin.getDepartment())
                .permissions(admin.getPermissions())
                .build();
    }
}
