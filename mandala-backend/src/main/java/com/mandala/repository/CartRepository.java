package com.mandala.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mandala.models.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

}r