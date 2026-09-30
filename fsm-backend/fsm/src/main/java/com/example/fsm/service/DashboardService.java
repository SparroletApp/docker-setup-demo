package com.example.fsm.service;

import com.example.fsm.dto.dashboarddto.DashboardRequestDto;
import com.example.fsm.dto.dashboarddto.DashboardResponseDto;

public interface DashboardService {

    DashboardResponseDto getDashboard(
            DashboardRequestDto request
    );
}