package com.mandala.dto;

import com.mandala.models.User.Role;
import lombok.Data;

@Data
public class UpdateUserDTO {
    private String username;
    private String email;
    private Role role;
    private String phoneNumber;
    public void setBio(String bio) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setBio'");
    }
    public void setLocation(String location) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setLocation'");
    }
    public void setWebsite(String website) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setWebsite'");
    }
}
