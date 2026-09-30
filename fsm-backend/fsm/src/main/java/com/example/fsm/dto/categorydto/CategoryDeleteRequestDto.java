package com.example.fsm.dto.categorydto;

import lombok.Data;

@Data
public class CategoryDeleteRequestDto {

    private Long id;

    private String deletedBy;
}