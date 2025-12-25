package com.mandala.service;

import com.mandala.repository.OrderRepository;
import com.mandala.repository.ProductRepository;
import com.mandala.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", productRepository.count());
        stats.put("pendingOrders", orderRepository.countByStatus("PENDING"));
        stats.put("totalRevenue", orderRepository.sumTotal());
        return stats;
    }
}
