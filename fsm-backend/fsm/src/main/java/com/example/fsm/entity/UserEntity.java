package com.example.fsm.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@EqualsAndHashCode(callSuper = true)
public class UserEntity extends BaseEntity {

    @Column(name = "name", length = 150)
    private String name;

    @Column(name = "phone", nullable = false, unique = true, length = 20)
    private String phone;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "role", nullable = false, length = 30)
    private String role;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "specialization", length = 150)
    private String specialization;

    @Column(name = "license", columnDefinition = "text[]")
    private String[] license;

    @Column(name = "upi_id", length = 100)
    private String upiId;

    @Column(name = "ability", length = 150)
    private String ability;

    @Column(name = "technician_id", unique = true, length = 30)
    private String technicianId;

    @Column(name = "otp", length = 6)
    private String otp;

    @Column(name = "otp_expires_at")
    private LocalDateTime otpExpiresAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", referencedColumnName = "id", nullable = false)
    private CompanyEntity company;
}