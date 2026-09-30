package com.example.fsm.dto.jobdto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateJobDto {

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

    private String createdBy;

    private String updatedBy;
}