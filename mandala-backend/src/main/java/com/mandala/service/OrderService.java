package com.mandala.service;

import com.mandala.dto.OrderRequestDTO;
import com.mandala.dto.OrderResponseDTO;
import com.mandala.models.User;

import java.util.List;

public interface OrderService {
    OrderResponseDTO placeOrder(User user, OrderRequestDTO request);

    List<OrderResponseDTO> getUserOrders(User user);

    OrderResponseDTO getOrderDetails(User user, Long orderId);

    List<OrderResponseDTO> getAllOrders(); // ✅ newly added
    
    OrderResponseDTO updateOrderStatus(Long orderId, String status);

    OrderResponseDTO getAnyOrderDetails(Long orderId); // New method for admin access
}
