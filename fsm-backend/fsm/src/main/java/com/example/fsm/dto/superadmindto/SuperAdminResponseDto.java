package com.example.fsm.dto.superadmindto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SuperAdminResponseDto {

    private Long id;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String token;
}