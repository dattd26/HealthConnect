package com.HealthConnect.Dto;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HealthDataRequest {
    @NotBlank(message = "Type is required")
    @Pattern(regexp = "BLOOD_PRESSURE|GLUCOSE|HEART_RATE", message = "Invalid type")
    private String type;

    @NotNull(message = "Value is required")
    @Positive(message = "Value must be positive")
    private Double value;
}
