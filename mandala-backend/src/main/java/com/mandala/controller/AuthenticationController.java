package com.mandala.controller;

import com.mandala.dto.*;
import com.mandala.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService service;

  @PostMapping("/register")
  public ResponseEntity<AuthenticationResponse> register(
      @RequestBody RegisterRequest request) {
    return ResponseEntity.ok(service.register(request));
  }

  @PostMapping("/authenticate")
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody AuthenticationRequest request) {
    return ResponseEntity.ok(service.authenticate(request));
  }

  @PostMapping("/refresh")
  public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
      return ResponseEntity.ok(service.refreshToken(request.getRefreshToken()));
  }

  @PostMapping("/exists")
    public ResponseEntity<Boolean> checkUserExists(
            @RequestBody UserExistsRequest request) {
        boolean exists = service.userExists(request.getId(), request.getUsername(), request.getRole());
        return ResponseEntity.ok(exists);
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<Void> updatePassword(
            @RequestBody UpdatePasswordRequest request) {
        service.updatePassword(request.getUsername(), request.getPassword());
        return ResponseEntity.ok().build();
    }

}
