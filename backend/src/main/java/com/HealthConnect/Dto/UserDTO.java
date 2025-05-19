package com.HealthConnect.Dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
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

}
