package com.mandala.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.mandala.models.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    
}