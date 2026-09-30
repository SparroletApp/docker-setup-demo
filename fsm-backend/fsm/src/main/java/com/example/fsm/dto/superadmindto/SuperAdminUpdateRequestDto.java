package com.example.fsm.dto.superadmindto;

import lombok.Data;

@Data
public class SuperAdminUpdateRequestDto {

    private Long id;
    private String email;
    private String password;
}