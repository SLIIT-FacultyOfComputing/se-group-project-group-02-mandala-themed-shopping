package com.mandala.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mandala.models.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    
}