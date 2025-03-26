package com.mandala.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mandala.models.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
}