package com.example.fsm.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "invoice")
@Data
@EqualsAndHashCode(callSuper = true)
public class InvoiceEntity extends BaseEntity {
    @Column(
            name = "invoice_id",
            nullable = false,
            unique = true,
            length = 50
    )
    private String invoiceId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "ticket_id",
            referencedColumnName = "id",
            nullable = false
    )
    private TicketEntity ticket;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "service_type_id",
            referencedColumnName = "id"
    )
    private ServiceTypeEntity serviceType;
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(
            name = "job_ids",
            columnDefinition = "bigint[]",
            nullable = false
    )
    private List<Long> jobIds;
    @Column(
            name = "service_charge",
            precision = 12,
            scale = 2,
            nullable = false
    )
    private BigDecimal serviceCharge = BigDecimal.ZERO;
    @Column(
            name = "parts_charge",
            precision = 12,
            scale = 2,
            nullable = false
    )
    private BigDecimal partsCharge = BigDecimal.ZERO;

    @Column(
            name = "total_price",
            precision = 12,
            scale = 2,
            nullable = false
    )
    private BigDecimal totalPrice = BigDecimal.ZERO;
    @Column(
            name = "working_hours",
            precision = 8,
            scale = 2
    )
    private BigDecimal workingHours = BigDecimal.ZERO;
    @Column(
            name = "status",
            nullable = false,
            length = 30
    )
    private String status = "DRAFT";
    @Column(
            name = "payment_status",
            nullable = false,
            length = 30
    )
    private String paymentStatus = "PENDING";
    @Column(
            name = "payment_method",
            length = 30
    )
    private String paymentMethod;
}