package com.HealthConnect.Constants;

public final class ValidationMessages {
    

    public static final String REQUIRED_FIELD = "This field is required";
    public static final String POSITIVE_NUMBER = "Value must be positive";
    public static final String INVALID_EMAIL = "Email should be valid";
    

    public static final String FULLNAME_REQUIRED = "Full name is required";
    public static final String FULLNAME_SIZE = "Full name must be between 2 and 100 characters";
    public static final String USERNAME_REQUIRED = "Username is required";
    public static final String USERNAME_SIZE = "Username must be between 3 and 50 characters";
    public static final String USERNAME_PATTERN = "Username can only contain letters, numbers and underscores";
    public static final String EMAIL_REQUIRED = "Email is required";
    public static final String PHONE_REQUIRED = "Phone is required";
    public static final String PHONE_PATTERN = "Phone number must be 10-11 digits";
    public static final String PASSWORD_REQUIRED = "Password is required";
    public static final String PASSWORD_SIZE = "Password must be at least 8 characters";
    public static final String PASSWORD_PATTERN = "Password must contain at least one lowercase letter, one uppercase letter, and one digit";
    public static final String ROLE_REQUIRED = "Role is required";
    public static final String ROLE_PATTERN = "Role must be PATIENT, DOCTOR, or ADMIN";
    public static final String LICENSE_SIZE = "License number cannot exceed 50 characters";
    
 
    public static final String DOCTOR_ID_REQUIRED = "Doctor ID is required";
    public static final String DOCTOR_ID_POSITIVE = "Doctor ID must be positive";
    public static final String NOTES_SIZE = "Notes cannot exceed 500 characters";
    public static final String APPOINTMENT_DATE_REQUIRED = "Appointment date is required";
    public static final String APPOINTMENT_DATE_FUTURE = "Appointment date must be in the future";
    public static final String START_TIME_REQUIRED = "Start time is required";
    
    private ValidationMessages() {

    }
}
