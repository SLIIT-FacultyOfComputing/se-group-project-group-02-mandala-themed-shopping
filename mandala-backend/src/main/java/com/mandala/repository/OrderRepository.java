package com.mandala.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.mandala.models.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}