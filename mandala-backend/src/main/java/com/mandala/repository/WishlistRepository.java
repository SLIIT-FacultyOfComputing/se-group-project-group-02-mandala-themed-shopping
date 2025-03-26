package com.mandala.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mandala.models.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

}