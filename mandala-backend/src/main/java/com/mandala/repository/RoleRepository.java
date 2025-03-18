package com.mandala.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mandala.models.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {

   
}