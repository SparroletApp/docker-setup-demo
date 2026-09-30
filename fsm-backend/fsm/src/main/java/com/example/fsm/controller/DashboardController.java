
package com.example.fsm.controller;

import com.example.fsm.dto.dashboarddto.DashboardRequestDto;
import com.example.fsm.dto.dashboarddto.DashboardResponseDto;
import com.example.fsm.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @PostMapping("/get")
    public ResponseEntity<DashboardResponseDto> getDashboard(
            @RequestBody DashboardRequestDto request
    ) {

        DashboardResponseDto response =
                dashboardService.getDashboard(request);

        return ResponseEntity.ok(response);
    }
}
