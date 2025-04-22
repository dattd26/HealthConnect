package com.HealthConnect.Dto;

import lombok.AllArgsConstructor;
<<<<<<< HEAD
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
//    private Long id;
    private String gender;
    private String fullName;
    private Date dateOfBirth;
    private String username;
    private String email;
    private String role;
    private String phone;
    private String address;

=======
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
>>>>>>> 5b660732c38a709a3325d523ef336b65669699d4
}
