package com.HealthConnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.HealthConnect.Config.EnvLoader;

@SpringBootApplication
public class HealthConnectApplication {

	public static void main(String[] args) {
		EnvLoader.loadEnv();
		SpringApplication.run(HealthConnectApplication.class, args);
	}

}
