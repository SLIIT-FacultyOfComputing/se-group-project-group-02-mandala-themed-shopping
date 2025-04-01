package com.mandala.controller;

import com.mandala.dto.CartItemDTO;
import com.mandala.models.User;
import com.mandala.service.CartService;
import lombok.RegigirquiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")  // Optional
public class CartController {

    private final CartService cartService;

    @PostMapping
    public ResponseEntity<?> addToCart(
            @AuthenticationPrincipal User user,
            @RequestBody CartItemDTO dto
    ) {
        cartService.addItemToCart(user, dto);
        return ResponseEntity.ok().build();
    }
}