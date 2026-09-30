package com.example.fsm.dto.jobdto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobResponseDto {

    private Long id;

    private String jobId;

    private Long userId;

    private Long ticketId;

    private Long categoryId;

    private Long partId;

    private String jobTitle;

    private String priority;

    private LocalDateTime expectedDate;

    private LocalDateTime startingDateTime;

    private LocalDateTime endingDateTime;

    private String employeeStatus;

    private String jobDescription;

    private String status;

    private LocalDateTime createdAt;

    private String createdBy;

    private LocalDateTime updatedAt;

    private String updatedBy;

    private Boolean deleted;

    private LocalDateTime deletedAt;

    private String deletedBy;
}