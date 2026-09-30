package com.example.fsm.service.Impl;

import com.example.fsm.dto.dashboarddto.DashboardRequestDto;
import com.example.fsm.dto.dashboarddto.DashboardResponseDto;
import com.example.fsm.repository.DashboardRepository;
import com.example.fsm.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final DashboardRepository dashboardRepository;

    @Override
    public DashboardResponseDto getDashboard(
            DashboardRequestDto request
    ) {

        if (request == null ||
                request.getCompanyId() == null) {

            throw new IllegalArgumentException(
                    "Company ID is required"
            );
        }

        Long companyId =
                request.getCompanyId();


        /*
         * =====================================================
         * ACTIVE TECHNICIERS
         * =====================================================
         */
        long technicianCount =
                dashboardRepository
                        .countActiveTechnicians();


        /*
         * =====================================================
         * ACTIVE CUSTOMERS
         * =====================================================
         */
        long customerCount =
                dashboardRepository
                        .countActiveCustomersByCompany(
                                companyId
                        );


        /*
         * =====================================================
         * PENDING / INCOMPLETE TICKETS
         * =====================================================
         */
        long pendingTicketCount =
                dashboardRepository
                        .countPendingTicketsByCompany(
                                companyId
                        );


        /*
         * =====================================================
         * PENDING / INCOMPLETE JOBS
         * =====================================================
         */
        long pendingJobCount =
                dashboardRepository
                        .countPendingJobsByCompany(
                                companyId
                        );


        /*
         * =====================================================
         * RESPONSE
         * =====================================================
         */
        DashboardResponseDto response =
                new DashboardResponseDto();


        response.setTechnicianCount(
                technicianCount
        );

        response.setCustomerCount(
                customerCount
        );

        response.setPendingTicketCount(
                pendingTicketCount
        );
        response.setPendingJobCount(
                pendingJobCount
        );
        return response;
    }
}