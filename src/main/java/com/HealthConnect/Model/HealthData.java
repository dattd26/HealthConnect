package com.HealthConnect.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Data
@AllArgsConstructor
@Table(name = "health_data")
public class HealthData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false)
    private String type; // BLOOD_PRESSURE, GLUCOSE, HEART_RATE

    @Column(nullable = false)
    private double value;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public HealthData(User user, String type, double value, LocalDateTime timestamp) {
        this.user = user;
        this.type = type;
        this.value = value;
        this.timestamp = timestamp;
    }
}
