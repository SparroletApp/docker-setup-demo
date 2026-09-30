package com.example.fsm.controller;

import com.example.fsm.dto.ticketdto.CreateTicketDto;
import com.example.fsm.dto.ticketdto.TicketIdDto;
import com.example.fsm.dto.ticketdto.TicketResponseDto;
import com.example.fsm.dto.ticketdto.UpdateTicketDto;
import com.example.fsm.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
@CrossOrigin
public class TicketController {

    private final TicketService ticketService;

    @PostMapping("/create")
    public ResponseEntity<TicketResponseDto> createTicket(
            @RequestBody CreateTicketDto dto) {

        TicketResponseDto response =
                ticketService.createTicket(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/all")
    public ResponseEntity<List<TicketResponseDto>> getAllTickets() {

        List<TicketResponseDto> response =
                ticketService.getAllTickets();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/get")
    public ResponseEntity<TicketResponseDto> getTicketById(
            @RequestBody TicketIdDto dto) {

        TicketResponseDto response =
                ticketService.getTicketById(dto);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/update")
    public ResponseEntity<TicketResponseDto> updateTicket(
            @RequestBody UpdateTicketDto dto) {

        TicketResponseDto response =
                ticketService.updateTicket(dto);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteTicket(
            @RequestBody TicketIdDto dto) {

        ticketService.deleteTicket(dto);

        return ResponseEntity.noContent().build();
    }
}