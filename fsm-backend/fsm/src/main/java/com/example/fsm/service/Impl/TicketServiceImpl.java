package com.example.fsm.service.Impl;

import com.example.fsm.dto.ticketdto.CreateTicketDto;
import com.example.fsm.dto.ticketdto.TicketIdDto;
import com.example.fsm.dto.ticketdto.TicketResponseDto;
import com.example.fsm.dto.ticketdto.UpdateTicketDto;
import com.example.fsm.entity.TicketEntity;
import com.example.fsm.repository.TicketRepository;
import com.example.fsm.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;


    // =========================================================
    // CREATE TICKET
    // =========================================================

    @Override
    public TicketResponseDto createTicket(
            CreateTicketDto dto
    ) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Request is required"
            );
        }

        if (dto.getCompanyId() == null) {
            throw new IllegalArgumentException(
                    "Company ID is required"
            );
        }

        if (dto.getCustomerId() == null) {
            throw new IllegalArgumentException(
                    "Customer ID is required"
            );
        }

        if (dto.getServiceTypeId() == null) {
            throw new IllegalArgumentException(
                    "Service Type ID is required"
            );
        }

        TicketEntity ticket =
                new TicketEntity();

        ticket.setServiceTypeId(
                dto.getServiceTypeId()
        );

        ticket.setCustomerId(
                dto.getCustomerId()
        );

        ticket.setCompanyId(
                dto.getCompanyId()
        );

        ticket.setTicketNote(
                dto.getTicketNote()
        );

        /*
         * New tickets start as OPEN.
         */
        ticket.setStatus("OPEN");

        ticket.setCreatedBy(
                dto.getCreatedBy()
        );


        /*
         * First save the ticket so that
         * the database generates the numeric ID.
         */
        TicketEntity savedTicket =
                ticketRepository.save(ticket);


        /*
         * Generate ticket number.
         *
         * Example:
         *
         * ID 1  -> TCK-00001
         * ID 25 -> TCK-00025
         */
        String ticketId =
                String.format(
                        "TCK-%05d",
                        savedTicket.getId()
                );

        savedTicket.setTicketId(
                ticketId
        );


        /*
         * Save again with generated
         * ticket ID.
         */
        savedTicket =
                ticketRepository.save(
                        savedTicket
                );


        return mapToResponse(
                savedTicket
        );
    }


    // =========================================================
    // GET ALL TICKETS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponseDto> getAllTickets() {

        return ticketRepository.findAll()
                .stream()
                .filter(ticket ->
                        !Boolean.TRUE.equals(
                                ticket.getDeleted()
                        )
                )
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET TICKET BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public TicketResponseDto getTicketById(
            TicketIdDto dto
    ) {

        if (dto == null ||
                dto.getId() == null) {

            throw new IllegalArgumentException(
                    "Ticket ID is required"
            );
        }

        TicketEntity ticket =
                ticketRepository.findById(
                                dto.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ticket not found"
                                )
                        );


        if (Boolean.TRUE.equals(
                ticket.getDeleted()
        )) {

            throw new RuntimeException(
                    "Ticket not found"
            );
        }


        return mapToResponse(
                ticket
        );
    }


    // =========================================================
    // UPDATE TICKET
    // =========================================================

    @Override
    public TicketResponseDto updateTicket(
            UpdateTicketDto dto
    ) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Request is required"
            );
        }

        if (dto.getId() == null) {
            throw new IllegalArgumentException(
                    "Ticket ID is required"
            );
        }

        TicketEntity ticket =
                ticketRepository.findById(
                                dto.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ticket not found"
                                )
                        );


        if (Boolean.TRUE.equals(
                ticket.getDeleted()
        )) {

            throw new RuntimeException(
                    "Ticket not found"
            );
        }


        /*
         * Service Type
         */
        if (dto.getServiceTypeId() != null) {

            ticket.setServiceTypeId(
                    dto.getServiceTypeId()
            );
        }


        /*
         * Customer
         */
        if (dto.getCustomerId() != null) {

            ticket.setCustomerId(
                    dto.getCustomerId()
            );
        }


        /*
         * Ticket Note
         */
        ticket.setTicketNote(
                dto.getTicketNote()
        );


        /*
         * Ticket Status
         *
         * Examples:
         * OPEN
         * IN_PROGRESS
         * COMPLETED
         * CANCELLED
         */
        if (dto.getStatus() != null &&
                !dto.getStatus().isBlank()) {

            ticket.setStatus(
                    dto.getStatus()
                            .trim()
                            .toUpperCase()
            );
        }


        /*
         * Audit
         */
        if (dto.getUpdatedBy() != null &&
                !dto.getUpdatedBy().isBlank()) {

            ticket.setUpdatedBy(
                    dto.getUpdatedBy()
                            .trim()
            );
        }

        ticket.setUpdatedAt(
                LocalDateTime.now()
        );


        TicketEntity updatedTicket =
                ticketRepository.save(
                        ticket
                );


        return mapToResponse(
                updatedTicket
        );
    }


    // =========================================================
    // DELETE TICKET
    // =========================================================

    @Override
    public void deleteTicket(
            TicketIdDto dto
    ) {

        if (dto == null ||
                dto.getId() == null) {

            throw new IllegalArgumentException(
                    "Ticket ID is required"
            );
        }

        TicketEntity ticket =
                ticketRepository.findById(
                                dto.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ticket not found"
                                )
                        );


        if (Boolean.TRUE.equals(
                ticket.getDeleted()
        )) {

            throw new RuntimeException(
                    "Ticket already deleted"
            );
        }


        ticket.setDeleted(true);

        ticket.setDeletedAt(
                LocalDateTime.now()
        );

        ticket.setDeletedBy(
                dto.getDeletedBy()
        );


        ticketRepository.save(
                ticket
        );
    }


    // =========================================================
    // MAP ENTITY → RESPONSE
    // =========================================================

    private TicketResponseDto mapToResponse(
            TicketEntity ticket
    ) {

        TicketResponseDto response =
                new TicketResponseDto();


        response.setId(
                ticket.getId()
        );

        response.setTicketId(
                ticket.getTicketId()
        );

        response.setServiceTypeId(
                ticket.getServiceTypeId()
        );

        response.setCustomerId(
                ticket.getCustomerId()
        );

        response.setCompanyId(
                ticket.getCompanyId()
        );

        response.setTicketNote(
                ticket.getTicketNote()
        );


        /*
         * Ticket Status
         */
        response.setStatus(
                ticket.getStatus()
        );


        response.setCreatedAt(
                ticket.getCreatedAt()
        );

        response.setCreatedBy(
                ticket.getCreatedBy()
        );

        response.setUpdatedAt(
                ticket.getUpdatedAt()
        );

        response.setUpdatedBy(
                ticket.getUpdatedBy()
        );

        response.setDeleted(
                ticket.getDeleted()
        );

        response.setDeletedAt(
                ticket.getDeletedAt()
        );

        response.setDeletedBy(
                ticket.getDeletedBy()
        );


        return response;
    }
}