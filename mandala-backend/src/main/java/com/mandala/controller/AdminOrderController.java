package com.mandala.controller;

import com.mandala.dto.OrderResponseDTO;
import com.mandala.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long orderId) {
        // Assuming OrderService has a method like getOrderDetails that is intended for admin use
        // This might be the existing getOrderDetails, but need to confirm its implementation handles admin context
        return ResponseEntity.ok(orderService.getAnyOrderDetails(orderId)); // Call new method for admin access
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        // Assuming OrderService has a method like updateOrderStatus
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
