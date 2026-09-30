package com.example.fsm.dto.invoicedto;

import lombok.Data;

@Data
public class InvoiceDeleteRequestDto {

    private Long id;

    private String deletedBy;
}
