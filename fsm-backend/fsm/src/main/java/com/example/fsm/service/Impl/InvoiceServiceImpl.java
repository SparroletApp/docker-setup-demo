package com.example.fsm.service.Impl;

import com.example.fsm.dto.invoicedto.CreateInvoiceDto;
import com.example.fsm.dto.invoicedto.InvoiceDeleteRequestDto;
import com.example.fsm.dto.invoicedto.InvoiceResponseDto;
import com.example.fsm.dto.invoicedto.UpdateInvoiceDto;
import com.example.fsm.entity.InvoiceEntity;
import com.example.fsm.entity.ServiceTypeEntity;
import com.example.fsm.entity.TicketEntity;
import com.example.fsm.repository.InvoiceRepository;
import com.example.fsm.repository.ServiceTypeRepository;
import com.example.fsm.repository.TicketRepository;
import com.example.fsm.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final TicketRepository ticketRepository;
    private final ServiceTypeRepository serviceTypeRepository;

    @Override
    public InvoiceResponseDto createInvoice(
            CreateInvoiceDto request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Invoice request cannot be null"
            );
        }

        if (request.getTicketId() == null) {
            throw new RuntimeException(
                    "Ticket ID is required"
            );
        }

        if (request.getJobIds() == null ||
                request.getJobIds().isEmpty()) {

            throw new RuntimeException(
                    "At least one job is required"
            );
        }

        TicketEntity ticket =
                ticketRepository
                        .findById(request.getTicketId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ticket not found with ID: "
                                                + request.getTicketId()
                                )
                        );

        ServiceTypeEntity serviceType = null;

        if (request.getServiceTypeId() != null) {

            serviceType =
                    serviceTypeRepository
                            .findById(
                                    request.getServiceTypeId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Service type not found with ID: "
                                                    + request.getServiceTypeId()
                                    )
                            );
        }

        BigDecimal serviceCharge =
                request.getServiceCharge() != null
                        ? request.getServiceCharge()
                        : BigDecimal.ZERO;

        BigDecimal partsCharge =
                request.getPartsCharge() != null
                        ? request.getPartsCharge()
                        : BigDecimal.ZERO;

        BigDecimal taxAmount =
                request.getTaxAmount() != null
                        ? request.getTaxAmount()
                        : BigDecimal.ZERO;

        BigDecimal totalPrice =
                request.getTotalPrice() != null
                        ? request.getTotalPrice()
                        : serviceCharge
                        .add(partsCharge)
                        .add(taxAmount);

        validateAmount(
                serviceCharge,
                "Service charge"
        );

        validateAmount(
                partsCharge,
                "Parts charge"
        );

        validateAmount(
                taxAmount,
                "Tax amount"
        );

        validateAmount(
                totalPrice,
                "Total price"
        );

        InvoiceEntity invoice =
                new InvoiceEntity();

        invoice.setInvoiceId(
                generateInvoiceId()
        );

        invoice.setTicket(
                ticket
        );

        invoice.setServiceType(
                serviceType
        );

        invoice.setJobIds(
                request.getJobIds()
        );

        invoice.setServiceCharge(
                serviceCharge
        );

        invoice.setPartsCharge(
                partsCharge
        );

        invoice.setTotalPrice(
                totalPrice
        );

        invoice.setWorkingHours(
                request.getWorkingHours() != null
                        ? request.getWorkingHours()
                        : BigDecimal.ZERO
        );

        invoice.setStatus(
                request.getStatus() != null &&
                        !request.getStatus().trim().isEmpty()
                        ? request.getStatus()
                        .trim()
                        .toUpperCase()
                        : "DRAFT"
        );

        invoice.setPaymentStatus(
                request.getPaymentStatus() != null &&
                        !request.getPaymentStatus()
                                .trim()
                                .isEmpty()
                        ? request.getPaymentStatus()
                        .trim()
                        .toUpperCase()
                        : "PENDING"
        );

        invoice.setPaymentMethod(
                request.getPaymentMethod()
        );


        invoice.setCreatedBy(
                request.getCreatedBy()
        );

        invoice.setUpdatedBy(
                request.getCreatedBy()
        );

        invoice.setCreatedAt(
                LocalDateTime.now()
        );

        invoice.setUpdatedAt(
                LocalDateTime.now()
        );

        invoice.setDeleted(
                false
        );

        InvoiceEntity savedInvoice =
                invoiceRepository.save(invoice);

        return mapToResponse(
                savedInvoice
        );
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponseDto getInvoice(
            Long id
    ) {

        if (id == null) {
            throw new RuntimeException(
                    "Invoice ID is required"
            );
        }

        InvoiceEntity invoice =
                invoiceRepository
                        .findByIdAndDeletedFalse(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found with ID: "
                                                + id
                                )
                        );

        return mapToResponse(
                invoice
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponseDto> getAllInvoices() {

        return invoiceRepository
                .findAllByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public InvoiceResponseDto updateInvoice(
            UpdateInvoiceDto request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Invoice update request cannot be null"
            );
        }

        if (request.getId() == null) {
            throw new RuntimeException(
                    "Invoice ID is required"
            );
        }

        InvoiceEntity invoice =
                invoiceRepository
                        .findByIdAndDeletedFalse(
                                request.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found with ID: "
                                                + request.getId()
                                )
                        );


        if (request.getTicketId() != null) {

            TicketEntity ticket =
                    ticketRepository
                            .findById(
                                    request.getTicketId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Ticket not found with ID: "
                                                    + request.getTicketId()
                                    )
                            );

            invoice.setTicket(
                    ticket
            );
        }

        if (request.getServiceTypeId() != null) {

            ServiceTypeEntity serviceType =
                    serviceTypeRepository
                            .findById(
                                    request.getServiceTypeId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Service type not found with ID: "
                                                    + request.getServiceTypeId()
                                    )
                            );

            invoice.setServiceType(
                    serviceType
            );
        }

        if (request.getJobIds() != null &&
                !request.getJobIds().isEmpty()) {

            invoice.setJobIds(
                    request.getJobIds()
            );
        }


        if (request.getServiceCharge() != null) {

            validateAmount(
                    request.getServiceCharge(),
                    "Service charge"
            );

            invoice.setServiceCharge(
                    request.getServiceCharge()
            );
        }
        if (request.getPartsCharge() != null) {

            validateAmount(
                    request.getPartsCharge(),
                    "Parts charge"
            );

            invoice.setPartsCharge(
                    request.getPartsCharge()
            );
        }

        

        if (request.getTotalPrice() != null) {

            validateAmount(
                    request.getTotalPrice(),
                    "Total price"
            );

            invoice.setTotalPrice(
                    request.getTotalPrice()
            );
        }

        if (request.getWorkingHours() != null) {

            if (request.getWorkingHours()
                    .compareTo(BigDecimal.ZERO) < 0) {

                throw new RuntimeException(
                        "Working hours cannot be negative"
                );
            }

            invoice.setWorkingHours(
                    request.getWorkingHours()
            );
        }

        if (request.getStatus() != null &&
                !request.getStatus()
                        .trim()
                        .isEmpty()) {

            invoice.setStatus(
                    request.getStatus()
                            .trim()
                            .toUpperCase()
            );
        }

        if (request.getPaymentStatus() != null &&
                !request.getPaymentStatus()
                        .trim()
                        .isEmpty()) {

            invoice.setPaymentStatus(
                    request.getPaymentStatus()
                            .trim()
                            .toUpperCase()
            );
        }

        if (request.getPaymentMethod() != null) {

            invoice.setPaymentMethod(
                    request.getPaymentMethod()
            );
        }

        if (request.getUpdatedBy() != null &&
                !request.getUpdatedBy()
                        .trim()
                        .isEmpty()) {

            invoice.setUpdatedBy(
                    request.getUpdatedBy()
            );
        }

        invoice.setUpdatedAt(
                LocalDateTime.now()
        );

        InvoiceEntity updatedInvoice =
                invoiceRepository.save(
                        invoice
                );

        return mapToResponse(
                updatedInvoice
        );
    }

    @Override
    public void deleteInvoice(
            InvoiceDeleteRequestDto request
    ) {

        if (request == null ||
                request.getId() == null) {

            throw new RuntimeException(
                    "Invoice ID is required"
            );
        }

        InvoiceEntity invoice =
                invoiceRepository
                        .findByIdAndDeletedFalse(
                                request.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found with ID: "
                                                + request.getId()
                                )
                        );

        invoice.setDeleted(
                true
        );

        invoice.setDeletedAt(
                LocalDateTime.now()
        );

        invoice.setDeletedBy(
                request.getDeletedBy()
        );

        invoice.setUpdatedAt(
                LocalDateTime.now()
        );

        invoice.setUpdatedBy(
                request.getDeletedBy()
        );

        invoiceRepository.save(
                invoice
        );
    }

    private String generateInvoiceId() {

        long nextNumber =
                invoiceRepository.count() + 1;

        String invoiceId =
                String.format(
                        "INV-%05d",
                        nextNumber
                );

        while (
                invoiceRepository
                        .existsByInvoiceIdAndDeletedFalse(
                                invoiceId
                        )
        ) {

            nextNumber++;

            invoiceId =
                    String.format(
                            "INV-%05d",
                            nextNumber
                    );
        }

        return invoiceId;
    }

    private void validateAmount(
            BigDecimal amount,
            String fieldName
    ) {

        if (amount.compareTo(
                BigDecimal.ZERO
        ) < 0) {

            throw new RuntimeException(
                    fieldName +
                            " cannot be negative"
            );
        }
    }

    private InvoiceResponseDto mapToResponse(
            InvoiceEntity invoice
    ) {

        InvoiceResponseDto response =
                new InvoiceResponseDto();

        response.setId(
                invoice.getId()
        );

        response.setInvoiceId(
                invoice.getInvoiceId()
        );


        if (invoice.getTicket() != null) {

            response.setTicketId(
                    invoice.getTicket().getId()
            );
        }

        if (invoice.getServiceType() != null) {

            response.setServiceTypeId(
                    invoice.getServiceType().getId()
            );
        }
        response.setJobIds(
                invoice.getJobIds()
        );
        response.setServiceCharge(
                invoice.getServiceCharge()
        );

        response.setPartsCharge(
                invoice.getPartsCharge()
        );



        response.setTotalPrice(
                invoice.getTotalPrice()
        );

        response.setWorkingHours(
                invoice.getWorkingHours()
        );

        response.setStatus(
                invoice.getStatus()
        );

        response.setPaymentStatus(
                invoice.getPaymentStatus()
        );

        response.setPaymentMethod(
                invoice.getPaymentMethod()
        );
        response.setCreatedAt(
                invoice.getCreatedAt()
        );

        response.setCreatedBy(
                invoice.getCreatedBy()
        );

        response.setUpdatedAt(
                invoice.getUpdatedAt()
        );

        response.setUpdatedBy(
                invoice.getUpdatedBy()
        );

        return response;
    }
}