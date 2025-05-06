package com.mandala.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.mandala.models.Order;
import com.mandala.models.User;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // ✅ Fetch all orders placed by a specific user
    List<Order> findByUser(User user);
    List<Order> findByUserId(Long userId);

}
