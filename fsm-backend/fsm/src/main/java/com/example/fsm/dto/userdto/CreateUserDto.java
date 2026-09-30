package com.example.fsm.dto.userdto;

import lombok.Data;

@Data
public class CreateUserDto {

    private String name;
    private String phone;
    private String email;
    private String role;
    private Long companyId;
    private String upiId;

    private String status;
    private String specialization;
    private String ability;
    private String[] license;
    private String createdBy;
    private String updatedBy;
}