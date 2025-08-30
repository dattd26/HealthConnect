package com.HealthConnect.Controller;

import com.HealthConnect.Dto.HealthRecordDTO;
import com.HealthConnect.Dto.UserDTO;
import com.HealthConnect.Model.HealthRecord;
import com.HealthConnect.Model.Patient;
import com.HealthConnect.Model.User;
import com.HealthConnect.Repository.HealthRecordRepository;
import com.HealthConnect.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    HealthRecordRepository healthRecordRepository;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println(userDetails.getUsername());
        User user = userService.getUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }

    // @GetMapping("/doctors")
    // public ResponseEntity<List<User>> getAllDoctors() {
    //     List<User> doctors = userService.getAllDoctors();
    //     return ResponseEntity.ok(doctors);
    // }
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile(@AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        User profile = userService.getUserByUsername(user.getUsername());
        UserDTO userDTOResponse = UserDTO
                .builder()
                .fullName(profile.getFullName())
                .gender(profile.getGender())
                .email(profile.getEmail())
                .dateOfBirth(profile.getDateOfBirth())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .role(profile.getRole())
                .build();
        return ResponseEntity.ok(userDTOResponse);
    }
    @PutMapping("/profile/update")
    public ResponseEntity<?> updateUserProfile(@AuthenticationPrincipal UserDetails user, @RequestBody UserDTO newData) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        User userProfile = userService.getUserByUsername(user.getUsername());
        userProfile.setAddress(newData.getAddress());
        userProfile.setDateOfBirth(newData.getDateOfBirth());
        userProfile.setEmail(newData.getEmail());
        userProfile.setFullName(newData.getFullName());
        userProfile.setGender(newData.getGender());
        userProfile.setPhone(newData.getPhone());
        try {
            userService.saveUser(userProfile);
            UserDTO userDTOResponse = UserDTO
                    .builder()
                    .fullName(userProfile.getFullName())
                    .gender(userProfile.getGender())
                    .email(userProfile.getEmail())
                    .dateOfBirth(userProfile.getDateOfBirth())
                    .phone(userProfile.getPhone())
                    .address(userProfile.getAddress())
                    .role(userProfile.getRole())
                    .build();
            return ResponseEntity.ok(Map.of("message", "Profile update successfully", "data", userDTOResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error updating profile: " + e.getMessage());
        }
    }
    @GetMapping("/health-record")
    public ResponseEntity<?> getCurrentUserHealthRecords(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Bạn chưa đăng nhập."));
        }

        User user = userService.getUserByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Người dùng không tồn tại."));
        }

        if (!(user instanceof Patient)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Chỉ bệnh nhân mới được truy cập hồ sơ sức khỏe."));
        }
        Patient patient = (Patient) user;
        HealthRecord record = healthRecordRepository.findByPatient(patient).orElseGet(() -> null);
        if (record == null) {
            return ResponseEntity.badRequest().body("User chua co ban record nao");
        }
        return ResponseEntity.ok(new HealthRecordDTO(record.getBloodType(), record.getHeight(), record.getWeight(),
                record.getBmi(),
                record.getMedicalConditions(),
                record.getAllergies(),
                record.getMedications()));
    }
    @PutMapping("/health-record/update")
    public ResponseEntity<?> updateUserHealthRecord(@AuthenticationPrincipal UserDetails userDetails, @RequestBody HealthRecordDTO recordDTO) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userService.getUserByUsername(userDetails.getUsername());
        if (!(user instanceof Patient)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Chỉ bệnh nhân mới được truy cập hồ sơ sức khỏe."));
        }
        Patient patient = (Patient) user;
        HealthRecord record = healthRecordRepository.findByPatient(patient)
                .orElseGet(() -> {
                    HealthRecord newRecord = new HealthRecord();
                    newRecord.setPatient(patient);
                    return newRecord;
                });

//        if (record == null) {
//            record = new HealthRecord();
//        }

        record.setBloodType(recordDTO.getBloodType());
        record.setHeight(recordDTO.getHeight());
        record.setWeight(recordDTO.getWeight());
        record.setBmi(recordDTO.getBmi());
        record.setMedicalConditions(recordDTO.getMedicalConditions());
        record.setMedications(recordDTO.getMedications());

        return ResponseEntity.ok(healthRecordRepository.save(record));
    }
}
