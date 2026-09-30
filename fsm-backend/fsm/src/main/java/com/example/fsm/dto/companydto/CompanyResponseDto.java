package com.example.fsm.dto.companydto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CompanyResponseDto {

    private Long id;
    private String legalName;
    private String brandName;
    private String phone;
    private String email;
    private String officeAddress;
    private String city;
    private String state;
    private String pincode;
    private String country;
    private Boolean isGstRegistered;
    private String gstIdentificationNumber;
    private String gstName;
    private String registeredGstAddress;
    private String registeredState;
    private String registeredPin;
    private LocalDateTime createdAt;
    private String createdBy;
    private String logo;
    private LocalDateTime updatedAt;
    private String updatedBy;
    private Boolean deleted;
    private LocalDateTime deletedAt;
    private String deletedBy;
    private Boolean taxEnabled;
    private BigDecimal taxPercentage;
}