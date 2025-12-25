package com.mandala.service;

import com.mandala.dto.UpdateUserDTO;
import com.mandala.dto.UserDTO;
import com.mandala.models.User;
import com.mandala.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private UserDTO mapToDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setPhoneNumber(user.getPhoneNumber());
        return dto;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return mapToDto(user);
    }

    @Override
    public UserDTO updateUser(Long id, UpdateUserDTO dto) {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
    
            user.setUsername(dto.getUsername());
            user.setEmail(dto.getEmail());
            user.setRole(dto.getRole());
            user.setPhoneNumber(dto.getPhoneNumber());
    
            return mapToDto(userRepository.save(user));
        }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Override
    public User getUserById(String name) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUserById'");
    }

}
