package com.example.fsm.dto.invoicedto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateInvoiceDto {

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

    private String createdBy;
}