package com.mandala.controller;

import com.mandala.dto.CartItemDTO;
import com.mandala.models.User;
import com.mandala.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/checkout")
    public ResponseEntity<String> checkoutCart(
            @AuthenticationPrincipal User user,
            @RequestBody List<CartItemDTO> items
    ) {
        cartService.processCheckout(user, items);
        return ResponseEntity.ok("Checkout completed and saved to DB.");
    }
}
