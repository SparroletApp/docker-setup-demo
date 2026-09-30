package com.example.fsm.dto.categorydto;

import lombok.Data;

@Data
public class UpdateCategoryDto {

    private Long id;

    private String name;

    private String description;

    private String updatedBy;
}