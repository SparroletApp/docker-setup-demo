package com.example.fsm.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@EqualsAndHashCode(callSuper = true)
public class JobEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            referencedColumnName = "id"
    )
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "ticket_id",
            referencedColumnName = "id",
            nullable = false
    )
    private TicketEntity ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "category_id",
            referencedColumnName = "id"
    )
    private CategoryEntity category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "part_id",
            referencedColumnName = "id"
    )
    private PartEntity part;

    @Column(
            name = "job_title",
            nullable = false,
            length = 200
    )
    private String jobTitle;

    @Column(
            name = "priority",
            nullable = false,
            length = 30
    )
    private String priority;

    @Column(name = "expected_date")
    private LocalDateTime expectedDate;

    @Column(name = "starting_date_time")
    private LocalDateTime startingDateTime;

    @Column(name = "ending_date_time")
    private LocalDateTime endingDateTime;

    @Column(
            name = "employee_status",
            length = 30
    )
    private String employeeStatus;

    @Column(
            name = "job_description",
            columnDefinition = "TEXT"
    )
    private String jobDescription;

    @Column(
            name = "status",
            nullable = false,
            length = 30
    )
    private String status;

    @Column(
            name = "job_id",
            nullable = false,
            unique = true,
            length = 50
    )
    private String jobId;
}