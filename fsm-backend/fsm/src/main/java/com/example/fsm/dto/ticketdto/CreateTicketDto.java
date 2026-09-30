package com.example.fsm.dto.ticketdto;

import lombok.Data;

@Data
public class CreateTicketDto {

    private Long serviceTypeId;

    private Long customerId;

    private Long companyId;

    private String ticketNote;

    private String createdBy;
}
