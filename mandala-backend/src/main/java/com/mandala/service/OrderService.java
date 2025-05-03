package com.mandala.service;

import com.mandala.dto.OrderRequestDTO;
import com.mandala.dto.OrderResponseDTO;
import com.mandala.models.User;

public interface OrderService {
    OrderResponseDTO placeOrder(User user, OrderRequestDTO request);
}
