package com.HealthConnect.Controller;

import com.HealthConnect.Dto.AuthenticationRequest;
import com.HealthConnect.Jwt.JwtTokenProvider;
import com.HealthConnect.Model.User;
import com.HealthConnect.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
    PasswordEncoder passwordEncoder;
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        // Kiểm tra email/phone đã tồn tại
        if (userService.checkExistsEmail(user.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // Mã hóa mật khẩu
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Mặc định chưa xác thực nếu là bác sĩ
        if (user.getRole().equals("DOCTOR")) {
            user.setVerified(false);
        }

        User newUser = userService.saveUser(user);
        return ResponseEntity.ok(newUser);
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthenticationRequest request) {
        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            User user = userService.getUserByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Kiểm tra xác thực
            if (!user.isVerified()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Tài khoản chưa được xác thực. Vui lòng kiểm tra email hoặc liên hệ Admin.");
            }

            String token = jwtTokenProvider.genarateTokens(request.getUsername());
            return ResponseEntity.ok(token);
        }
        catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Dang nhap khong thang cong");
        }
    }


}