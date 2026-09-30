package com.example.fsm.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Entity
@Table(name = "company")
@Data
@EqualsAndHashCode(callSuper = true)
public class CompanyEntity extends BaseEntity {

    @Column(name = "legal_name", nullable = false)
    private String legalName;

    @Column(name = "brand_name")
    private String brandName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "office_address", columnDefinition = "TEXT")
    private String officeAddress;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "pincode")
    private String pincode;

    @Column(name = "logo", columnDefinition = "TEXT")
    private String logo;

    @Column(name = "country")
    private String country;

    @Column(name = "is_gst_registered")
    private Boolean isGstRegistered;

    @Column(name = "gst_identification_number")
    private String gstIdentificationNumber;

    @Column(name = "gst_name")
    private String gstName;

    @Column(name = "registered_gst_address", columnDefinition = "TEXT")
    private String registeredGstAddress;

    @Column(name = "registered_state")
    private String registeredState;

    @Column(name = "registered_pin")
    private String registeredPin;

    @Column(name = "tax_enabled", nullable = false)
    private Boolean taxEnabled = false;

    @Column(name = "tax_percentage", precision = 5, scale = 2)
    private BigDecimal taxPercentage;
}