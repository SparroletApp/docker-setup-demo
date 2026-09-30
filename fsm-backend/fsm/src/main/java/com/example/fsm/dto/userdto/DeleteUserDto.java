package com.example.fsm.dto.userdto;

import lombok.Data;

@Data
public class DeleteUserDto {

    private Long id;

    private String deletedBy;
}