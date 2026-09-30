package com.example.fsm.repository;

import com.example.fsm.entity.JobEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<JobEntity, Long> {

    List<JobEntity> findByDeletedFalse();

    List<JobEntity> findByUser_IdAndDeletedFalse(Long userId);
    List<JobEntity> findByUserIsNullAndDeletedFalse();;

}