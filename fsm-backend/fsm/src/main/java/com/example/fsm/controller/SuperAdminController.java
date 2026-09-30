package com.example.fsm.controller;

import com.example.fsm.dto.superadmindto.*;
import com.example.fsm.service.SuperAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/super-admin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final SuperAdminService superAdminService;

    @PostMapping("/create")
    public ResponseEntity<SuperAdminResponseDto> createSuperAdmin(
            @RequestBody SuperAdminRequestDto request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(superAdminService.createSuperAdmin(request));
    }

    @PostMapping("/update")
    public ResponseEntity<SuperAdminResponseDto> updateSuperAdmin(
            @RequestBody SuperAdminUpdateRequestDto request) {

        return ResponseEntity.ok(
                superAdminService.updateSuperAdmin(request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<SuperAdminResponseDto> login(
            @RequestBody SuperAdminLoginRequestDto request) {

        return ResponseEntity.ok(
                superAdminService.login(request)
        );
    }

    @PostMapping("/list")
    public ResponseEntity<List<SuperAdminResponseDto>> getAllSuperAdmins() {

        return ResponseEntity.ok(
                superAdminService.getAllSuperAdmins()
        );
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteSuperAdmin(
            @RequestBody SuperAdminIdRequestDto request) {

        superAdminService.deleteSuperAdmin(request);

        return ResponseEntity.noContent().build();
    }
}