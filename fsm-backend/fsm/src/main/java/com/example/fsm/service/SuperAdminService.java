package com.example.fsm.service;

import com.example.fsm.dto.superadmindto.*;

import java.util.List;

public interface SuperAdminService {

    SuperAdminResponseDto createSuperAdmin(SuperAdminRequestDto request);

    SuperAdminResponseDto updateSuperAdmin(
            SuperAdminUpdateRequestDto request
    );

    SuperAdminResponseDto login(
            SuperAdminLoginRequestDto request);

    List<SuperAdminResponseDto> getAllSuperAdmins();

    void deleteSuperAdmin(SuperAdminIdRequestDto request);
}