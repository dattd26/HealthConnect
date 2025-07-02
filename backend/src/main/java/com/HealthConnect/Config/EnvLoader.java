package com.HealthConnect.Config;

import org.springframework.context.annotation.Configuration;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class EnvLoader {
    public static void loadEnv() {
        Dotenv dotenv = Dotenv
                .configure()
                .directory(System.getProperty("user.dir"))
                .ignoreIfMissing()
                .load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }
}
