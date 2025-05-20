package com.mandala.controller;

import com.mandala.dto.OrderRequestDTO;
import com.mandala.dto.OrderResponseDTO;
import com.mandala.models.User;
import com.mandala.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Place new order
    @PostMapping
    public ResponseEntity<OrderResponseDTO> placeOrder(
            @AuthenticationPrincipal User user,
            @RequestBody OrderRequestDTO request
    ) {
        return ResponseEntity.ok(orderService.placeOrder(user, request));
    }

    // Get current user's orders
    @GetMapping("/user")
    public ResponseEntity<List<OrderResponseDTO>> getUserOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }

    // Get specific order details for a user
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrderDetails(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId
    ) {
        return ResponseEntity.ok(orderService.getOrderDetails(user, orderId));
    }

    // Admin: Get all orders
    @GetMapping("/admin")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
