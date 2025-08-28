package com.HealthConnect.Config;

import com.HealthConnect.Model.Admin;
import com.HealthConnect.Repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (adminRepository.count() == 0) {
            Admin admin = new Admin(
                "Administrator",
                "admin",
                "admin@healthconnect.com",
                "0123456789",
                passwordEncoder.encode("Admin@123")
            );
            
            admin.setDepartment("System Administration");
            admin.setPermissions("ALL");
            
            adminRepository.save(admin);
            System.out.println("Đã tạo tài khoản admin mặc định:");
            System.out.println("Username: admin");
            System.out.println("Password: Admin@123");
            System.out.println("Email: admin@healthconnect.com");
        }
    }
}
