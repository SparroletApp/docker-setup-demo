package com.example.fsm.dto.partdto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePartDto {

    private String name;

    private String sku;

    private Long categoryId;

    private Integer stockQuantity;

    private Integer thresholdAlert;

    private BigDecimal unitPrice;

    private BigDecimal retailPrice;

    private String supplier;

    private String createdBy;
}