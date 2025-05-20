package com.mandala.controller;

import com.mandala.dto.*;
import com.mandala.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000") // ✅ Allow frontend access
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request) {
        System.out.println("📥 Registering user: " + request.getUsername());
        return ResponseEntity.ok(service.register(request));
    }
    // @PostMapping("/authenticate")
    // public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
    //     AuthenticationService authService = null;
    //     AuthenticationResponse response = authService.authenticate(request); // generate both tokens
    //     return ResponseEntity.ok(response);
    // }
    
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
    public ResponseEntity<Boolean> checkUserExists(@RequestBody UserExistsRequest request) {
        boolean exists = service.userExists(request.getId(), request.getUsername(), request.getRole());
        return ResponseEntity.ok(exists);
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestBody UpdatePasswordRequest request) {
        try {
            // Validate request data
            if (request.getUsername() == null || request.getUsername().isEmpty()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Username is required"));
            }
            
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("New password is required"));
            }
            
            if (request.getCurrentPassword() != null) {
                // Use the new method with current password verification
                service.updatePassword(request.getUsername(), request.getCurrentPassword(), request.getPassword());
            } else {
                // For backward compatibility
                service.updatePassword(request.getUsername(), request.getPassword());
            }
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
