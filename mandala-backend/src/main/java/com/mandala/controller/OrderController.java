package com.mandala.controller;

import com.mandala.dto.OrderRequestDTO;
import com.mandala.dto.OrderResponseDTO;
import com.mandala.models.User;
import com.mandala.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponseDTO> placeOrder(
            @AuthenticationPrincipal User user,
            @RequestBody OrderRequestDTO request
    ) {
        OrderResponseDTO response = orderService.placeOrder(user, request);
        return ResponseEntity.ok(response);
    }
}
