package com.example.fsm.dto.userdto;

import lombok.Data;

@Data
public class LoginResponseDto {

    private String token;

    private UserResponseDto user;
}