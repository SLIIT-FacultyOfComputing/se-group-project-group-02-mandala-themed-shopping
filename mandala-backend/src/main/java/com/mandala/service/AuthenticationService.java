package com.mandala.service;

import com.mandala.dto.AuthenticationRequest;
import com.mandala.dto.AuthenticationResponse;
import com.mandala.dto.RegisterRequest;
import com.mandala.models.User;
import com.mandala.config.JwtService;
import com.mandala.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

  private final UserRepository repository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthenticationResponse register(RegisterRequest request) {
    var user = User.builder()
        .username(request.getUsername())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .phoneNumber(request.getPhoneNumber())
        .role(User.Role.USER) // ✅ assign default role
        .build();

    repository.save(user);

    var accessToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);

    return AuthenticationResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .build();
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(),
            request.getPassword())
    );

    var user = repository.findByUsername(request.getUsername())
        .orElseThrow();

    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);

    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .refreshToken(refreshToken)
        .build();
  }

  public AuthenticationResponse refreshToken(String refreshToken) {
    String username = jwtService.extractUsername(refreshToken);
    var user = repository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (!jwtService.validateToken(refreshToken, user)) {
      throw new RuntimeException("Invalid refresh token");
    }

    var newAccessToken = jwtService.generateToken(user);
    var newRefreshToken = jwtService.generateRefreshToken(user);

    return AuthenticationResponse.builder()
        .accessToken(newAccessToken)
        .refreshToken(newRefreshToken)
        .build();
  }

  public boolean userExists(Long id, String username, User.Role role) {
    return repository.existsByIdAndUsernameAndRole(id, username, role);
  }

  public void updatePassword(String username, String currentPassword, String newPassword) {
    // Input validation
    if (username == null || username.isEmpty()) {
      throw new IllegalArgumentException("Username cannot be null or empty");
    }
    
    if (currentPassword == null || currentPassword.isEmpty()) {
      throw new IllegalArgumentException("Current password cannot be null or empty");
    }
    
    if (newPassword == null || newPassword.isEmpty()) {
      throw new IllegalArgumentException("New password cannot be null or empty");
    }
    
    var userOptional = repository.findByUsername(username);
    
    if (userOptional.isEmpty()) {
      throw new RuntimeException("User not found");
    }
    
    User user = userOptional.get();
    
    // Verify the current password
    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(username, currentPassword)
      );
      
      // If authentication successful, update password
      user.setPassword(passwordEncoder.encode(newPassword));
      repository.save(user);
    } catch (AuthenticationException e) {
      throw new RuntimeException("Current password is incorrect");
    }
  }
  
  // Update the old method for backward compatibility to handle null values
  public void updatePassword(String username, String password) {
    // Input validation
    if (username == null || username.isEmpty()) {
      throw new IllegalArgumentException("Username cannot be null or empty");
    }
    
    if (password == null || password.isEmpty()) {
      throw new IllegalArgumentException("Password cannot be null or empty");
    }
    
    var userOptional = repository.findByUsername(username);
    
    if (userOptional.isEmpty()) {
      throw new RuntimeException("User not found");
    }
    
    User user = userOptional.get();
    user.setPassword(passwordEncoder.encode(password));
    repository.save(user);
  }
}
