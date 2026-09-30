package com.example.fsm.service;

import com.example.fsm.dto.invoicedto.CreateInvoiceDto;
import com.example.fsm.dto.invoicedto.InvoiceDeleteRequestDto;
import com.example.fsm.dto.invoicedto.InvoiceResponseDto;
import com.example.fsm.dto.invoicedto.UpdateInvoiceDto;

import java.util.List;

public interface InvoiceService {

    InvoiceResponseDto createInvoice(CreateInvoiceDto request);
    InvoiceResponseDto getInvoice(Long id);
    List<InvoiceResponseDto> getAllInvoices();
    InvoiceResponseDto updateInvoice(UpdateInvoiceDto request);
    void deleteInvoice(InvoiceDeleteRequestDto request);
}
