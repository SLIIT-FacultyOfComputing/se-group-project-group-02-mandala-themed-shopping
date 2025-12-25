package com.mandala.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mandala.models.Customization;

public interface CustomizationRepository extends JpaRepository<Customization, Long> {


}