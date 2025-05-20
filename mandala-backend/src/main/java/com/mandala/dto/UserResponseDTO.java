package com.mandala.dto;

import com.mandala.models.User.Role;
import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private Role role;
}
