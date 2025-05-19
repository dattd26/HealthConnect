package com.HealthConnect.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MeetingRequest {
    private String meetingNumber;
    private Integer role;
    private Integer expirationSeconds;
    private String videoWebRtcMode;
    private String password;


}
