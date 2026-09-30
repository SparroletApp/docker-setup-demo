package com.example.fsm.dto.ticketdto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketResponseDto {

    private Long id;

    private String ticketId;

    private Long serviceTypeId;

    private String status;
    private Long customerId;

    private Long companyId;

    private String ticketNote;

    private LocalDateTime createdAt;

    private String createdBy;

    private LocalDateTime updatedAt;

    private String updatedBy;

    private Boolean deleted;

    private LocalDateTime deletedAt;

    private String deletedBy;
}
