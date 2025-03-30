package com.HealthConnect.Dto;

import com.HealthConnect.Model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    String token;
    User user;

}
