package com.example.fsm.dto.userdto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponseDto {

    private Long id;

    private String name;

    private String phone;

    private String email;

    private String role;

    private String technicianId;

    private String status;

    private String specialization;

    private String ability;
    private String upiId;


    private String[] license;

    private Long companyId;

    private LocalDateTime createdAt;
    private String createdBy;

    private LocalDateTime updatedAt;
    private String updatedBy;

    private Boolean deleted;
    private LocalDateTime deletedAt;
    private String deletedBy;
}