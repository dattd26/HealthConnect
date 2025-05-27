package com.HealthConnect.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendVerificationEmail(String email, String token)  {
        String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + token;
        String subject = "Xác thực tài khoản HealthConnect";
        String content = "Vui lòng nhấp vào link sau để xác thực tài khoản: " + verificationUrl;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject(subject);
            
            message.setText(content);
            javaMailSender.send(message);
        } catch (MailException e) {
            e.printStackTrace();
            throw new RuntimeException("Cant not send mail");
        }
    }
}
