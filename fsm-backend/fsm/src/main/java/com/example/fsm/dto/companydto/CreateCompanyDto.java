package com.example.fsm.dto.companydto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class CreateCompanyDto {

    private Long id;
    private String legalName;
    private String brandName;
    private MultipartFile logo;
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
    private Boolean taxEnabled;
    private BigDecimal taxPercentage;
}