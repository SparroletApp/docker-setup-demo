package com.example.fsm.dto.servicetypedto;

import lombok.Data;

@Data
public class CreateServiceTypeDto {

    private String name;

    private String description;

    private String createdBy;
}