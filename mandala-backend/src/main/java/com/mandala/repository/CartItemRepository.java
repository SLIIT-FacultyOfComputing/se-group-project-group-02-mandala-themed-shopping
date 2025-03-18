package com.mandala.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mandala.models.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

   
}