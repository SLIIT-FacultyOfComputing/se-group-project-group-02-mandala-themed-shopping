package com.mandala.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.mandala.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
}