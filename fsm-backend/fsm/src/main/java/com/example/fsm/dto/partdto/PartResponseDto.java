package com.example.fsm.dto.partdto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PartResponseDto {

    private Long id;

    private String name;

    private String sku;

    private Long categoryId;

    private String categoryName;

    private Integer stockQuantity;

    private Integer thresholdAlert;

    private BigDecimal unitPrice;

    private BigDecimal retailPrice;

    private String supplier;

    private String createdBy;

    private LocalDateTime createdAt;

    private String updatedBy;

    private LocalDateTime updatedAt;
}