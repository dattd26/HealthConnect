package com.HealthConnect.Model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "doctors")
public class Doctor extends User {
    private List<String> specialty;
    private String license;
}
