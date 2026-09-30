package com.example.fsm.controller;

import com.example.fsm.dto.invoicedto.CreateInvoiceDto;
import com.example.fsm.dto.invoicedto.InvoiceDeleteRequestDto;
import com.example.fsm.dto.invoicedto.InvoiceResponseDto;
import com.example.fsm.dto.invoicedto.UpdateInvoiceDto;
import com.example.fsm.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/create")
    public ResponseEntity<InvoiceResponseDto> createInvoice(
            @RequestBody CreateInvoiceDto request
    ) {

        InvoiceResponseDto response =
                invoiceService.createInvoice(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/get")
    public ResponseEntity<InvoiceResponseDto> getInvoice(
            @RequestBody UpdateInvoiceDto request
    ) {

        InvoiceResponseDto response =
                invoiceService.getInvoice(
                        request.getId()
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/all")
    public ResponseEntity<List<InvoiceResponseDto>> getAllInvoices() {

        List<InvoiceResponseDto> response =
                invoiceService.getAllInvoices();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/update")
    public ResponseEntity<InvoiceResponseDto> updateInvoice(
            @RequestBody UpdateInvoiceDto request
    ) {

        InvoiceResponseDto response =
                invoiceService.updateInvoice(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteInvoice(
            @RequestBody InvoiceDeleteRequestDto request
    ) {

        invoiceService.deleteInvoice(request);

        return ResponseEntity.ok(
                "Invoice deleted successfully."
        );
    }
}
