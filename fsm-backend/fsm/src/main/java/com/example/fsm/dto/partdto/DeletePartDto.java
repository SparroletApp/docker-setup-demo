package com.example.fsm.dto.partdto;

import lombok.Data;

@Data
public class DeletePartDto {

    private Long id;

    private String deletedBy;
}