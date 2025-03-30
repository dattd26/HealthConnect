package com.HealthConnect.Controller;

import com.HealthConnect.Dto.AuthenticationRequest;
import com.HealthConnect.Dto.LoginResponse;
import com.HealthConnect.Dto.RegisterRequest;
import com.HealthConnect.Dto.UserDTO;
import com.HealthConnect.Jwt.JwtTokenProvider;
import com.HealthConnect.Model.User;
import com.HealthConnect.Service.EmailService;
import com.HealthConnect.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    EmailService emailService;

    @Autowired
    PasswordEncoder passwordEncoder;
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        // Kiểm tra email/phone đã tồn tại
        if (userService.checkExistsEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }
        User user = new User();
        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        // Mã hóa mật khẩu
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        if ("DOCTOR".equalsIgnoreCase(request.getRole())) {
            user.setVerified(false);
            user.setLicense(request.getLicense());
            user.setSpecialty(request.getSpecialty());
        }
        else {
            String token = jwtTokenProvider.genarateTokens(user.getUsername());
            emailService.sendVerificationEmail(user.getEmail(), token);
        }
        User newUser = userService.saveUser(user);
        return ResponseEntity.ok(newUser);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            User user = userService.getUserByUsername(request.getUsername());

            // Kiểm tra xác thực
            if (!user.isVerified()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(null, new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRole())));
            }

            String token = jwtTokenProvider.genarateTokens(request.getUsername());
            return ResponseEntity.ok(new LoginResponse(token, new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRole())));
        }
        catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Dang nhap khong thang cong");
        }
    }
    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        String username = jwtTokenProvider.getUserFromJWT(token);

        User user = userService.getUserByUsername(username);
        user.setVerified(true);
        userService.saveUser(user);

        return ResponseEntity.ok("Xác thực thành công!");

    }
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest().body("Token không được cung cấp");
            }

            // Kiểm tra tính hợp lệ của token
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Token không hợp lệ hoặc đã hết hạn");
            }

            // Lấy username từ token
            String username = jwtTokenProvider.getUserFromJWT(token);

            // Lấy thông tin user từ username (tùy chọn)
            User user = userService.getUserByUsername(username);

            // Trả về thông tin user hoặc chỉ xác nhận token hợp lệ
            return ResponseEntity.ok(Map.of("userData", new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRole()), "tokenValid", true));
//            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Xác thực token thất bại: " + e.getMessage());
        }
    }
}