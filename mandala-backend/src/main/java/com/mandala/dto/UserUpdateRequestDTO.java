package com.mandala.dto;

import lombok.Data;

@Data
public class UserUpdateRequestDTO {
    private String username;
    private String email;
    private String phoneNumber;
    private String bio;
    private String location;
    private String website;
}
