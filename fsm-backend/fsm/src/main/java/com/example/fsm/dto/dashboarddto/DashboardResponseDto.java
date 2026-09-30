package com.example.fsm.dto.dashboarddto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardResponseDto {

    private long technicianCount;

    private long customerCount;

    private long pendingTicketCount;

    private long pendingJobCount;
}