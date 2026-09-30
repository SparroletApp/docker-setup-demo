package com.example.fsm.repository;

import com.example.fsm.entity.CustomersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomersRepository
        extends JpaRepository<CustomersEntity, Long> {

    List<CustomersEntity> findByDeletedFalse();
}