package com.example.fsm.dto.dashboarddto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardRequestDto {

    private Long companyId;

    private String userPhone;

    private String role;

    private String fromDate;

    private String toDate;
}