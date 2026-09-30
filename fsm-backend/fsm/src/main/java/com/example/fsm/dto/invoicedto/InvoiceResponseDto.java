package com.example.fsm.dto.invoicedto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InvoiceResponseDto {

    private Long id;

    private String invoiceId;

    private Long ticketId;

    private Long serviceTypeId;

    private List<Long> jobIds;

    private BigDecimal serviceCharge;

    private BigDecimal partsCharge;

    private BigDecimal taxAmount;

    private BigDecimal totalPrice;

    private BigDecimal workingHours;

    private String status;

    private String paymentStatus;

    private String paymentMethod;

    private LocalDateTime createdAt;

    private String createdBy;

    private LocalDateTime updatedAt;

    private String updatedBy;

    private Boolean deleted;

    private LocalDateTime deletedAt;

    private String deletedBy;
}