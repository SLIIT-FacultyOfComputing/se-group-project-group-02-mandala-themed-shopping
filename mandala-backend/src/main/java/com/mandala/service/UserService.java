package com.mandala.service;

import com.mandala.dto.UpdateUserDTO;
import com.mandala.dto.UserDTO;
import com.mandala.models.User;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long id);
    UserDTO updateUser(Long id, UpdateUserDTO dto);
    void deleteUser(Long id);
    User getUserById(String name);
}
