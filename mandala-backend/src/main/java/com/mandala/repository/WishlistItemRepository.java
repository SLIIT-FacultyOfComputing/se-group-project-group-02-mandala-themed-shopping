package com.mandala.repository;

import com.mandala.models.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
}
