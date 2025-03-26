package com.mandala.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mandala.models.WishlistItem;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

}