package com.mandala.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mandala.models.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByIdAndUsernameAndRole(Long id, String username, User.Role role);


}