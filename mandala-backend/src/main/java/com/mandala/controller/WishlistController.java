package com.mandala.controller;

import com.mandala.models.Wishlist;
import com.mandala.models.WishlistItem;
import com.mandala.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<Wishlist> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlistByUserId(userId));
    }

    @PostMapping("/{userId}/add/{productId}")
    public ResponseEntity<WishlistItem> addToWishlist(@PathVariable Long userId, @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(userId, productId));
    }

    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long userId, @PathVariable Long productId) {
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/move-to-cart/{productId}")
    public ResponseEntity<Void> moveToCart(@PathVariable Long userId, @PathVariable Long productId) {
        wishlistService.moveToCart(userId, productId);
        return ResponseEntity.ok().build();
    }
}
