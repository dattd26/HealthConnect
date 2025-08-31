package com.HealthConnect.Controller;

import com.HealthConnect.Dto.AuthenticationRequest;
import com.HealthConnect.Dto.LoginResponse;
import com.HealthConnect.Dto.RegisterRequest;
import com.HealthConnect.Dto.UserDTO;
import com.HealthConnect.Factory.UserFactoryImpl;
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

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.MailException;
import java.util.Map;

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
    @Autowired
    UserFactoryImpl userFactory;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
            
        if (userService.checkExistsEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email has been used");
        }
        User user = userFactory.createUser(request, passwordEncoder);
        
        try {
            String token = jwtTokenProvider.genarateTokens(user.getUsername());
            emailService.sendVerificationEmail(user.getEmail(), token);
            userService.saveUser(user);
            
            return ResponseEntity.ok("Registration successful! Please check your email to verify your account.");
        } catch (MailException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().body("Cant not send mail");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed");
        }    
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            User user = userService.getUserByUsername(request.getUsername());
            UserDTO userDTORes = UserDTO
                    .builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .gender(user.getGender())
                    .email(user.getEmail())
                    .dateOfBirth(user.getDateOfBirth())
                    .phone(user.getPhone())
                    .address(user.getAddress())
                    .role(user.getRole())
                    .build();
            
            if (!user.isVerified()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Account not verified");
            }

            String token = jwtTokenProvider.genarateTokens(request.getUsername());
            return ResponseEntity.ok(new LoginResponse(token, userDTORes));

        }
        catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Đăng nhập không thành công: " + e.getMessage());
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

            
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Token không hợp lệ hoặc đã hết hạn");
            }


            String username = jwtTokenProvider.getUserFromJWT(token);

            
            User user = userService.getUserByUsername(username);
            UserDTO userDTORes = UserDTO
                    .builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .gender(user.getGender())
                    .email(user.getEmail())
                    .dateOfBirth(user.getDateOfBirth())
                    .phone(user.getPhone())
                    .address(user.getAddress())
                    .role(user.getRole())
                    .build();

            return ResponseEntity.ok(Map.of("userData", userDTORes, "token", token, "tokenValid", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Xác thực token thất bại: " + e.getMessage());
        }
    }
}