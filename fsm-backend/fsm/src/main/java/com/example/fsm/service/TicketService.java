package com.example.fsm.service;

import com.example.fsm.dto.ticketdto.CreateTicketDto;
import com.example.fsm.dto.ticketdto.TicketIdDto;
import com.example.fsm.dto.ticketdto.TicketResponseDto;
import com.example.fsm.dto.ticketdto.UpdateTicketDto;

import java.util.List;

public interface TicketService {

    TicketResponseDto createTicket(CreateTicketDto dto);

    List<TicketResponseDto> getAllTickets();

    TicketResponseDto getTicketById(TicketIdDto dto);

    TicketResponseDto updateTicket(UpdateTicketDto dto);

    void deleteTicket(TicketIdDto dto);
}