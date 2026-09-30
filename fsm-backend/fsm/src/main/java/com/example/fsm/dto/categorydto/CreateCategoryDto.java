package com.example.fsm.dto.categorydto;

import lombok.Data;

@Data
public class CreateCategoryDto {

    private String name;

    private String description;

    private String createdBy;

    private String updatedBy;
}