package com.example.fsm.dto.customerdto;

import lombok.Data;

@Data
public class CreateCustomerDto {

    private Long id;
    private String name;
    private String phone;
    private String address;
    private String pincode;
    private Long companyId;
    private String createdBy;
}