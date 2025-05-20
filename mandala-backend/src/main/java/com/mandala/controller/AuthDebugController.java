package com.mandala.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthDebugController {

    @GetMapping("/api/debug/auth")
    public ResponseEntity<?> debugAuth(Authentication auth) {
        if (auth == null) {
            System.out.println("🔍 No authentication found.");
            return ResponseEntity.ok("NO AUTHENTICATION");
        }

        System.out.println("✅ /api/debug/auth called. Authorities: " + auth.getAuthorities());
        return ResponseEntity.ok(auth.getAuthorities());
    }
}
