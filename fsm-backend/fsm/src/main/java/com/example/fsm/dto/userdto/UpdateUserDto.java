package com.example.fsm.dto.userdto;

import lombok.Data;

@Data
public class UpdateUserDto {

    private Long id;

    private String name;

    private String phone;

    private String email;

    private String role;

    private String status;

    private String specialization;

    private String ability;
    private String upiId;

    private String[] license;

    private Long companyId;

    private String updatedBy;
}