package com.HealthConnect.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;

@Entity
@Table(name = "patients")
public class Patient extends User {
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private HealthRecord healthRecord;
}
