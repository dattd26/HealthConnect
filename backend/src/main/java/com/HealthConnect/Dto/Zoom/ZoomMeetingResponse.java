package com.HealthConnect.Dto.Zoom;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ZoomMeetingResponse {
    private String uuid;
    private long id;
    
    @JsonProperty("host_id")
    private String hostId;
    
    @JsonProperty("host_email")
    private String hostEmail;
    
    private String topic;
    private String agenda;
    private int type;
    private String status;
    
    @JsonProperty("start_time")
    private String startTime;
    
    private int duration;
    private String timezone;
    
    @JsonProperty("join_url")
    private String joinUrl;
    
    @JsonProperty("start_url")
    private String startUrl;
    
    private String password;
}
