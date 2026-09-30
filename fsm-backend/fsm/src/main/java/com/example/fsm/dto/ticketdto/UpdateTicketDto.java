package com.example.fsm.dto.ticketdto;

import lombok.Data;

@Data
public class UpdateTicketDto {

    private Long id;

    private Long serviceTypeId;

    private Long customerId;

    private String ticketNote;

    private String status;

    private String updatedBy;
}