package com.HealthConnect.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;


import java.util.Properties;

@Configuration
public class EmailConfig {

//    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.email.com");
        mailSender.setPort(587);
        mailSender.setUsername("datriseofkd@gmail.com");
        mailSender.setPassword("az0777541112");

        Properties properties = mailSender.getJavaMailProperties();
        properties.put("spring.mail.protocol", "smtp");
        properties.put("spring.mail.smtp.auth", true);
        properties.put("spring.mail.smtp.starttls.enable", true);

        return mailSender;
    }
}
