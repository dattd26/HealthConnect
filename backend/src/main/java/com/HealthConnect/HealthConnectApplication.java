package com.HealthConnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.HealthConnect.Config.EnvLoader;

@SpringBootApplication
@EnableScheduling
public class HealthConnectApplication {

	public static void main(String[] args) {
		EnvLoader.loadEnv();
		SpringApplication.run(HealthConnectApplication.class, args);
	}

}
