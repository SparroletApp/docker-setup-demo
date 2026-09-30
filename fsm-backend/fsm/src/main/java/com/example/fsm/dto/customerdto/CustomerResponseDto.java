
package com.example.fsm.dto.customerdto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CustomerResponseDto {

    private Long id;
    private String customerId;
    private String name;
    private String phone;
    private String address;
    private String pincode;
    private Long companyId;
    private String createdBy;
    private LocalDateTime createdAt;
    private String updatedBy;
    private LocalDateTime updatedAt;
}
