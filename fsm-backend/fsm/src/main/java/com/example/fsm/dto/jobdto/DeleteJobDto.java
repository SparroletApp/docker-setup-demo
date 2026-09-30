package com.example.fsm.dto.jobdto;

import lombok.Data;

@Data
public class DeleteJobDto {

    private Long id;

    private String deletedBy;
}