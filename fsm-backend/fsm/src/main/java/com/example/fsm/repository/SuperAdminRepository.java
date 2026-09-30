package com.example.fsm.repository;

import com.example.fsm.entity.SuperAdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SuperAdminRepository extends JpaRepository<SuperAdminEntity, Long> {

    boolean existsByEmail(String email);
    Optional<SuperAdminEntity> findByEmail(String email);
}