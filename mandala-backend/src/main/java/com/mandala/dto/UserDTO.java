package com.mandala.dto;

import com.mandala.models.User.Role;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private String phoneNumber;
}
