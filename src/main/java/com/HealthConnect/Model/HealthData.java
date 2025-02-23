package com.HealthConnect.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "health_data")
public class HealthData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;
    private double value;

}
