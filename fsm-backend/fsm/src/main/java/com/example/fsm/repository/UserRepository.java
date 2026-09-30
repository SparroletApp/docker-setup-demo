package com.example.fsm.repository;

import com.example.fsm.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByPhone(String phone);

    boolean existsByPhone(String phone);

    List<UserEntity> findByDeletedFalse();
    boolean existsByTechnicianId(String technicianId);
}