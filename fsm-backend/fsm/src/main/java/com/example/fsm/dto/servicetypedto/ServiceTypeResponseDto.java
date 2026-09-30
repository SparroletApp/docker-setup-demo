package com.example.fsm.dto.servicetypedto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ServiceTypeResponseDto {

    private Long id;

    private String name;

    private String description;

    private LocalDateTime createdAt;

    private String createdBy;

    private LocalDateTime updatedAt;

    private String updatedBy;

    private Boolean deleted;

    private LocalDateTime deletedAt;

    private String deletedBy;
}