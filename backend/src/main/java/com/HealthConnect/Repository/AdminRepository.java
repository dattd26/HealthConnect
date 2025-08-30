package com.HealthConnect.Repository;

import com.HealthConnect.Model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    
    Optional<Admin> findByUsername(String username);
    
    Optional<Admin> findByEmail(String email);
    
    List<Admin> findByDepartment(String department);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}
