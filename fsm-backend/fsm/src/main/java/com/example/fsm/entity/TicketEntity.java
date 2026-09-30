package com.example.fsm.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tickets")
public class TicketEntity extends BaseEntity {

    @Column(name = "ticket_id", nullable = false)
    private String ticketId;

    @Column(name = "service_type_id", nullable = false)
    private Long serviceTypeId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "ticket_note", columnDefinition = "TEXT")
    private String ticketNote;

    @Column(name = "status")
    private String status;
}