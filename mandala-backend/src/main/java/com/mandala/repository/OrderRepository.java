package com.mandala.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mandala.models.Order;
import com.mandala.models.User;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // ✅ Fetch all orders placed by a specific user
    List<Order> findByUser(User user);
    List<Order> findByUserId(Long userId);

     long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o")
double sumTotal();


}
