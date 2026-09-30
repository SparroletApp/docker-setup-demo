package com.example.fsm.dto.servicetypedto;

import lombok.Data;

@Data
public class UpdateServiceTypeDto {

    private Long id;

    private String name;

    private String description;

    private String updatedBy;
}